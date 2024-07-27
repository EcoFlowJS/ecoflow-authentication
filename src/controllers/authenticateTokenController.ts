import { EcoContext } from "@ecoflow/types";
import JWT from "jsonwebtoken";
import fetchJWKPublicKey from "../helpers/fetchJWKPublicKey";

/**
 * Controls the execution of a function within the EcoContext.
 * @returns None
 */
async function functionController(this: EcoContext) {
  const { _ } = ecoFlow;

  /**
   * Destructures the inputs and next properties from the current object and initializes
   * the payload variable.
   * @returns None
   */
  const { payload, inputs, next, request } = this;

  /**
   * Checks if the inputs variable is undefined and returns early if it is.
   * @param {any} inputs - The variable to check for undefined.
   * @returns None
   */
  if (_.isUndefined(inputs)) return;

  /**
   * Destructures the inputs object to extract specific keys for further use.
   * @param {object} inputs - The object containing input values.
   * @returns None
   */
  const {
    responseKey,
    algorithm,
    secretORprivateKeySelector,
    secretORpublicKey,
    fromEnvironmentVariable,
  } = inputs;

  /**
   * Checks if the authorization header is missing or empty in the request.
   * If so, sets the response payload to "Invalid authorization" and status to 401.
   * @param {Object} request - The request object containing headers.
   * @param {Object} payload - The response payload object.
   * @param {string} responseKey - The key in the payload object to set the response message.
   * @returns None
   */
  if (
    _.isUndefined(request.headers.authorization) ||
    _.isEmpty(request.headers.authorization)
  ) {
    payload[responseKey] = "Invalid authorization";
    this.status = 401;
    return;
  }

  /**
   * Extracts the raw token from the Authorization header in the request.
   * @param {Request} request - The request object containing the headers.
   * @returns The raw token extracted from the Authorization header.
   */
  const rawToken = request.headers.authorization.split(" ")[1];

  /**
   * Checks if the rawToken is empty or not a string. If it is empty or not a string,
   * sets the response message to "Invalid authorization" and status code to 401.
   * @param {any} rawToken - The raw token to validate.
   * @param {string} responseKey - The key to set the response message in the payload.
   * @returns None
   */
  if (_.isEmpty(rawToken) || !_.isString(rawToken)) {
    payload[responseKey] = "Invalid authorization";
    this.status = 401;
    return;
  }

  /**
   * Retrieves a secret or private key based on the selector and environment variables.
   * @param {string} secretORprivateKeySelector - The selector for secret or private key.
   * @param {string} secretORpublicKey - The secret or public key value.
   * @param {boolean} fromEnvironmentVariable - Flag to indicate if the key is from an environment variable.
   * @returns The secret or private key based on the selector and environment variables.
   */
  const secret =
    secretORprivateKeySelector === "secret"
      ? fromEnvironmentVariable
        ? process.env[secretORpublicKey]
        : secretORpublicKey
      : await fetchJWKPublicKey(
          fromEnvironmentVariable
            ? process.env[secretORpublicKey]
            : secretORpublicKey
        );

  /**
   * Verifies a JSON Web Token using the provided secret and algorithm.
   * If verification is successful, the result is added to the payload under the specified response key.
   * If verification fails, the error message is added to the payload and the status is set to 401.
   * @param {string} rawToken - The raw JSON Web Token to verify.
   * @param {string} secret - The secret key used to verify the token.
   * @param {string} algorithm - The algorithm used for verification.
   * @param {string} responseKey - The key under which to store the verification result or error message in the payload.
   * @param {Function} next - The callback function to call after verification.
   * @returns None
   */
  try {
    /**
     * Verifies a JSON Web Token using the provided secret and algorithm.
     * @param {string} rawToken - The raw JSON Web Token to verify.
     * @param {string} secret - The secret key used to verify the token.
     * @param {string} algorithm - The algorithm used for verification.
     * @returns {Promise<object>} A promise that resolves with the payload of the verified token.
     * @throws {Error} If there is an error during verification, it will be rejected with the error.
     */
    const result = await new Promise((resolve, reject) => {
      JWT.verify(
        rawToken,
        secret,
        { algorithms: [algorithm] },
        (error, jwtPayload) => {
          if (error) reject(error);
          resolve(jwtPayload);
        }
      );
    });

    /**
     * Assigns the 'result' value to the 'responseKey' property in the 'payload' object.
     * @param {object} payload - The object to which the result will be assigned.
     * @param {string} responseKey - The key in the payload object where the result will be stored.
     * @param {*} result - The value to be assigned to the responseKey in the payload object.
     */
    payload[responseKey] = result;

    next();
  } catch (error: any) {
    /**
     * Set the response payload to the error message and update the status code to 401.
     * @param {string} responseKey - The key in the payload object to store the error message.
     * @param {Error} error - The error object containing the error message.
     * @returns None
     */
    payload[responseKey] = error.message;
    this.status = 401;
    return;
  }
}

export default functionController;
