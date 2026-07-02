const env = require('../config/env');
const { sendError } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Server error';
  let errorsList = [];

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 422; // Validation Error
    message = 'Validation failed';
    errorsList = Object.values(err.errors).map(val => ({
      field: val.path,
      message: val.message
    }));
  }
  
  // Mongoose Cast Error (Invalid Object ID)
  else if (err.name === 'CastError') {
    statusCode = 400; // Bad Request
    message = `Invalid field: ${err.path}`;
    errorsList = [{ message: `Value '${err.value}' is not a valid type` }];
  }

  // Multer Error (File Uploads)
  else if (err.name === 'MulterError') {
    statusCode = 400; // Bad Request
    message = 'File upload failed';
    if (err.code === 'LIMIT_FILE_SIZE') {
      errorsList = [{ field: err.field || 'file', message: 'File size exceeds the 5MB limit' }];
    } else {
      errorsList = [{ field: err.field || 'file', message: err.message }];
    }
  }

  // Custom reject from fileFilter
  else if (err.message && err.message.includes('Only image files are allowed!')) {
    statusCode = 400;
    message = 'Invalid file type';
    errorsList = [{ field: 'profilePicture', message: err.message }];
  }

  // Attach stack trace in non-production
  if (env.NODE_ENV !== 'production' && errorsList.length === 0) {
    errorsList = [{ message: err.message, stack: err.stack }];
  }

  return sendError(res, message, errorsList, statusCode);
};

module.exports = errorHandler;
