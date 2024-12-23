/**
 * Format username: Capitalize the first letter of the username.
 * @param {string} username - The username to format.
 * @returns {string} - The formatted username.
 */
function formatUsername(username) {
  if (!username) return ""; // Handle empty or undefined usernames
  return username.charAt(0).toUpperCase() + username.slice(1);
}

module.exports = formatUsername;

