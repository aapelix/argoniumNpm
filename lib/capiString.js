/**
 * Capitalizes the first letter of a given string.
 * @param {string} str - The string to capitalize.
 * @returns {string} The capitalized string.
 */

function capiString(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports.capiString = capiString;