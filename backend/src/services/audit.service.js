/**
 * Audit Logging Service Foundation
 * Handles recording application security, auth, and data events.
 * Currently prints to console, but can be updated later to write to MongoDB/external systems
 * without changing the caller interface.
 */

/**
 * Log an audit event
 * @param {Object} eventDetails
 * @param {String} eventDetails.userId - The ID of the user executing the action (defaults to 'anonymous')
 * @param {String} eventDetails.action - The event name (e.g., 'USER_SIGNUP', 'USER_LOGIN', 'HABIT_CREATE')
 * @param {String} eventDetails.requestId - Request ID associated with the execution (optional)
 * @param {Object} eventDetails.metadata - Additional contextual payload (optional)
 */
const logEvent = async ({ userId = 'anonymous', action, requestId = 'N/A', metadata = {} }) => {
  const timestamp = new Date().toISOString();
  
  // Console logging implementation for now
  console.log(
    `[AUDIT] [${timestamp}] [Action: ${action}] [User: ${userId}] [Req: ${requestId}]`,
    Object.keys(metadata).length > 0 ? `Metadata: ${JSON.stringify(metadata)}` : ''
  );
  
  // MongoDB/Winston logging will be wired here in future iterations:
  // await AuditLog.create({ userId, action, requestId, metadata, timestamp });
};

module.exports = {
  logEvent,
};
