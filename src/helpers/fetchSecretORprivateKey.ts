import fse from "fs-extra";

/**
 * Fetches the secret or private key based on the algorithm provided.
 * @param {("HS256" | "HS384" | "RS256" | "RS384")} algorithm - The algorithm used for encryption.
 * @param {string} key - The key used for encryption.
 * @returns A promise that resolves to a tuple containing the key or buffer and the algorithm used.
 */
const fetchSecretORprivateKey = async (
  algorithm: "HS256" | "HS384" | "RS256" | "RS384",
  key: string
): Promise<[string | Buffer, "HS256" | "HS384" | "RS256" | "RS384"]> => {
  /**
   * Check if the algorithm is either "HS256" or "HS384" and return the key and algorithm.
   * @param {string} algorithm - The algorithm to check.
   * @param {string} key - The key associated with the algorithm.
   * @returns An array containing the key and algorithm if the condition is met.
   */
  if (algorithm === "HS256" || algorithm === "HS384") return [key, algorithm];

  /**
   * Checks if a file exists at the specified key, and if it does, reads the file and returns it along with the algorithm.
   * @param {string} key - The key to check for the existence of a file.
   * @param {string} algorithm - The algorithm to be returned along with the file content.
   * @returns {Promise<[Buffer, string]>} A promise that resolves to an array containing the file content as a Buffer and the algorithm.
   */
  const stats = (await fse.exists(key)) && (await fse.stat(key)).isFile();

  if (stats) {
    return [await fse.readFile(key), algorithm];
  }

  /**
   * Returns an array containing the ECOFLOW_SYS_TOKEN_SALT as a string and the algorithm
   * based on the provided algorithm type.
   * @param {string} algorithm - The algorithm type for token generation.
   * @returns An array with the ECOFLOW_SYS_TOKEN_SALT and the selected algorithm.
   */
  return [
    process.env.ECOFLOW_SYS_TOKEN_SALT as string,
    algorithm === "RS256" ? "HS256" : algorithm === "RS384" ? "HS384" : "HS256",
  ];
};

export default fetchSecretORprivateKey;
