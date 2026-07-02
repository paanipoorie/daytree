const { Readable } = require('stream');
const cloudinary = require('../config/cloudinary');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const { logEvent } = require('../services/audit.service');

/**
 * Helper function to upload file buffer to Cloudinary using streams
 */
const uploadToCloudinary = (fileBuffer, folder = 'daytree') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    
    Readable.from(fileBuffer).pipe(uploadStream);
  });
};

/**
 * Helper function to delete file from Cloudinary by public ID
 */
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Failed to clean up Cloudinary image:', error.message);
  }
};

/**
 * Setup user profile (username, profile picture) after signup or update it if already onboarded
 */
exports.setupProfile = asyncHandler(async (req, res, next) => {
  const { username } = req.body;
  const user = req.user;
  const isAlreadyOnboarded = user.isOnboarded;

  const updateData = {
    username,
  };

  // Only set isOnboarded to true if they are not already onboarded
  if (!isAlreadyOnboarded) {
    updateData.isOnboarded = true;
  }

  let uploadResult = null;

  // If file was uploaded by multer, upload to Cloudinary
  if (req.file) {
    try {
      uploadResult = await uploadToCloudinary(req.file.buffer, 'daytree_profiles');
      updateData.profilePicture = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError.message);
      return sendError(res, 'Failed to upload profile picture to Cloudinary', [], 500);
    }
  }

  try {
    // Find and update user in database
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!updatedUser) {
      // If db update fails and we uploaded an image, clean it up from Cloudinary
      if (uploadResult) {
        await deleteFromCloudinary(uploadResult.public_id);
      }
      return sendError(res, 'User not found', [], 404);
    }

    // If update includes a new picture and we had an old picture, delete the old picture from Cloudinary
    if (req.file && user.profilePicture && user.profilePicture.publicId) {
      await deleteFromCloudinary(user.profilePicture.publicId);
    }

    const userResponse = {
      id: updatedUser._id,
      email: updatedUser.email,
      username: updatedUser.username,
      profilePicture: updatedUser.profilePicture,
      isOnboarded: updatedUser.isOnboarded,
      createdAt: updatedUser.createdAt,
    };

    const message = isAlreadyOnboarded 
      ? 'Profile updated successfully' 
      : 'Profile setup completed successfully';

    // Log audit event
    await logEvent({
      userId: updatedUser._id.toString(),
      action: isAlreadyOnboarded ? 'USER_PROFILE_UPDATE' : 'USER_PROFILE_SETUP',
      requestId: req.requestId,
      metadata: {
        username: updatedUser.username,
        hasProfilePicture: !!(updatedUser.profilePicture && updatedUser.profilePicture.url)
      }
    });

    return sendSuccess(res, message, { user: userResponse }, 200);

  } catch (dbError) {
    // Graceful cleanup: if database save fails, destroy the newly uploaded Cloudinary image
    if (uploadResult) {
      await deleteFromCloudinary(uploadResult.public_id);
    }
    return sendError(res, dbError.message || 'Database error', [], 500);
  }
});
