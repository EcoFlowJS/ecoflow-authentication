import { URL } from "url";

/**
 * Checks if a given string is a valid URL by attempting to create a new URL object with it.
 * @param {string} url - The string to check if it is a valid URL.
 * @returns {boolean} - True if the string is a valid URL, false otherwise.
 */
const stringIsAValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export default stringIsAValidUrl;
