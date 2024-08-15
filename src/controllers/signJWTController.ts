import { EcoContext } from "@ecoflow/types";
import JWT from "jsonwebtoken";
import fetchSecretORprivateKey from "../helpers/fetchSecretORprivateKey";

/**
 * Asynchronous function that controls the flow of a function within the EcoContext.
 * @this {EcoContext} - The context in which the function is executed.
 * @returns None
 */
async function functionController(ctx: EcoContext) {
  const { _ } = ecoFlow;

  /**
   * Destructures the inputs and next properties from the current object and initializes
   * the payload variable.
   * @returns None
   */
  const { payload, inputs, next } = ctx;

  /**
   * Checks if the inputs variable is undefined and returns early if true.
   * @param {*} inputs - The variable to check for undefined.
   * @returns None
   */
  if (_.isUndefined(inputs)) return;

  /**
   * Destructures the inputs object to extract specific keys for further use.
   * @param {object} inputs - The object containing input keys.
   * @returns Destructured keys for payloadKey, responseKey, expiresIn, algorithm, secretORprivateKey, secretORprivateKeyFromEnvironment.
   */
  const {
    payloadKey,
    responseKey,
    expiresIn,
    algorithm,
    secretORprivateKey,
    secretORprivateKeyFromEnvironment,
  } = inputs;

  /**
   * Retrieves the value of the specified key from the payload object, or an empty object if the key does not exist.
   * @param {object} payload - The payload object from which to retrieve the value.
   * @param {string} payloadKey - The key to retrieve from the payload object.
   * @returns The value of the specified key from the payload object, or an empty object if the key does not exist.
   */
  const jwtPayload = payload[payloadKey] || {};

  /**
   * Fetches the secret or private key based on the provided algorithm and environment variables.
   * @param {string} algorithm - The algorithm used for encryption.
   * @param {string} secretORprivateKeyFromEnvironment - Flag indicating whether the secret or private key is fetched from environment variables.
   * @param {string} secretORprivateKey - The secret or private key to fetch.
   * @returns An array containing the secret or private key and the signing algorithm.
   */
  const [secret, signAlgorithm] = await fetchSecretORprivateKey(
    algorithm,
    secretORprivateKeyFromEnvironment
      ? process.env[secretORprivateKey] || ""
      : secretORprivateKey
  );

  /**
   * Generates a JSON Web Token (JWT) using the provided payload, secret, expiration time, and signing algorithm.
   * @param {object} jwtPayload - The payload to be included in the JWT.
   * @param {string} secret - The secret key used to sign the JWT.
   * @param {object} expiresIn - The expiration time for the JWT.
   * @param {string} signAlgorithm - The algorithm used for signing the JWT.
   * @returns {string} A signed JWT token.
   */
  const token = JWT.sign(jwtPayload, secret, {
    expiresIn,
    algorithm: signAlgorithm,
  });

  /**
   * Assigns a token to a specific key in the payload object.
   * @param {object} payload - The payload object to which the token will be assigned.
   * @param {string} responseKey - The key in the payload object where the token will be assigned.
   * @param {string} token - The token to be assigned to the specified key in the payload object.
   * @returns None
   */
  payload[responseKey] = token;

  next();
}

export default functionController;
