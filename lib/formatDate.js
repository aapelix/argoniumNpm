/**
 * Formats a date string into a desired format.
 * @param {string} dateString - The date string to format.
 * @param {string} format - The desired format (e.g., "YYYY-MM-DD", "DD/MM/YYYY").
 * @returns {string} The formatted date string.
 */

function formatDate(dateString, format) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  // Replace placeholders in the format string with corresponding date values
  const formattedDate = format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day);

  return formattedDate;
}

module.exports.formatDate = formatDate;