import { EcoContext } from "@ecoflow/types";
import fse from "fs-extra";
import { pem2jwk } from "pem-jwk";

/**
 * Controller function to handle JWT JWKS requests.
 * @async
 * @function jwtJWKSController
 * @param {EcoContext} ctx - The context object containing ecoFlow, payload, inputs, and next.
 * @returns {Promise<void>} - A promise that resolves when the function completes.
 */
async function jwtJWKSController(ctx: EcoContext) {
  const { _, log } = ecoFlow;

  /**
   * Destructures the inputs and next properties from the current object and initializes
   * the payload variable.
   * @returns None
   */
  const { payload, inputs, next } = ctx;

  /**
   * Checks if the inputs variable is undefined and returns early if true.
   * @param {any} inputs - The variable to check for undefined.
   * @returns None
   */
  if (_.isUndefined(inputs)) return;

  /**
   * Destructures the 'inputs' object to extract 'responseKey', 'publicKey', and 'fromEnvironmentVariable'.
   * @param {object} inputs - The object containing the keys to destructure.
   * @returns None
   */
  const { responseKey, publicKey, fromEnvironmentVariable } = inputs;

  /**
   * Retrieves the secret path based on the value of the fromEnvironmentVariable flag.
   * If fromEnvironmentVariable is true, it retrieves the secret path from the process environment variables.
   * If fromEnvironmentVariable is false, it uses the publicKey directly as the secret path.
   * @param {boolean} fromEnvironmentVariable - Flag to determine whether to retrieve the secret path from environment variables.
   * @param {string} publicKey - The public key used to retrieve the secret path from environment variables.
   * @returns {string} The secret path based on the conditions.
   */
  const secretPath = fromEnvironmentVariable
    ? process.env[publicKey]
    : publicKey;

  /**
   * Try to read a secret from the specified path and convert it to JWK format.
   * If successful, add the JWK to the payload and call the next middleware function.
   * If the secret file does not exist, set response to "key not found" and status to 404.
   * If an error occurs during the process, log the error, set response to "error occurred",
   * and status to 500.
   * @param {string} secretPath - The path to the secret file.
   * @param {object} payload - The payload object to store the response.
   * @param {string} responseKey - The key in the payload object to store the response.
   * @param {Function} next - The next middleware
   */
  try {
    /**
     * Checks if a secret file exists at the specified path and updates the payload and status accordingly.
     * @param {string} secretPath - The path to the secret file.
     * @param {object} payload - The payload object to update.
     * @param {string} responseKey - The key in the payload object to update.
     * @returns None
     */
    if (!(await fse.exists(secretPath))) {
      payload[responseKey] = "key not found";
      ctx.status = 404;
      return;
    }

    /**
     * Reads the contents of a file at the specified path using the 'ascii' encoding.
     * @param {string} secretPath - The path to the file to be read.
     * @returns A promise that resolves with the contents of the file as a string.
     */
    const secret = await fse.readFile(secretPath, "ascii");

    /**
     * Converts a PEM-encoded secret key to a JWK (JSON Web Key) format with the specified options.
     * @param {string} secret - The PEM-encoded secret key to convert.
     * @param {object} options - Additional options for the conversion (e.g., specifying the key's intended use).
     * @returns The JWK representation of the secret key.
     */
    const jwk = pem2jwk(secret, { use: "sig" });

    /**
     * Assigns a JSON Web Key (JWK) to a specific key in the payload object.
     * @param {object} payload - The payload object to which the JWK will be assigned.
     * @param {string} responseKey - The key in the payload object where the JWK will be assigned.
     * @param {object} jwk - The JSON Web Key (JWK) to be assigned to the payload.
     * @returns None
     */
    payload[responseKey] = [jwk];

    next();
  } catch (error) {
    /**
     * Logs the error, sets a response key to "error occurred", sets the status to 500, and returns.
     * @param {Error} error - The error that occurred.
     * @param {string} responseKey - The key in the payload to set to "error occurred".
     * @returns None
     */
    log.error(error);
    payload[responseKey] = "error occurred";
    ctx.status = 500;
    return;
  }
}

export default jwtJWKSController;
