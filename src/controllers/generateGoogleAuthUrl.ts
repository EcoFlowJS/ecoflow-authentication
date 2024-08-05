import { EcoContext } from "@ecoflow/types";
import { Auth } from "googleapis";

async function generateGoogleAuthUrl(this: EcoContext) {
  const { _ } = ecoFlow;

  /**
   * Destructures the properties 'payload', 'inputs', and 'next' from the current object.
   * @returns None
   */
  const { payload, inputs, next } = this;

  /**
   * Checks if the inputs variable is undefined and returns early if it is.
   * @param {any} inputs - The variable to check for undefined.
   * @returns None
   */
  if (_.isUndefined(inputs)) return;

  /**
   * Destructures the inputs object to extract clientId, clientIdFromEnv, clientSecret,
   * clientSecretFromEnv, redirectUri, and redirectUriFromEnv.
   * @param {object} inputs - The object containing client details.
   * @returns None
   */
  const {
    clientId,
    clientIdFromEnv,
    clientSecret,
    clientSecretFromEnv,
    redirectUri,
    redirectUriFromEnv,
  } = inputs;

  /**
   * Retrieves the OAuth client ID from the environment variables if clientIdFromEnv is true,
   * otherwise uses the provided clientId.
   * @param {boolean} clientIdFromEnv - Flag indicating whether to use the client ID from environment variables.
   * @param {string} clientId - The default client ID to use if clientIdFromEnv is false.
   * @returns The OAuth client ID to use.
   */
  const oAuthClientID = clientIdFromEnv ? process.env[clientId] : clientId;

  /**
   * Retrieves the OAuth client secret from the environment variables if available,
   * otherwise falls back to the provided client secret.
   * @param {string} clientSecretFromEnv - The environment variable name for the client secret.
   * @param {string} clientSecret - The default client secret.
   * @returns The OAuth client secret.
   */
  const oAuthClientSecret = clientSecretFromEnv
    ? process.env[clientSecret]
    : clientSecret;

  /**
   * Determines the OAuth redirect URI based on the environment variable or a default value.
   * @param {string} redirectUriFromEnv - The environment variable containing the redirect URI.
   * @param {string} redirectUri - The default redirect URI.
   * @returns The OAuth redirect URI to be used.
   */
  const oAuthRedirectUri = redirectUriFromEnv
    ? process.env[redirectUri]
    : redirectUri;

  /**
   * Validates the Google OAuth client credentials and returns an error message if any of the required fields are missing.
   * @param {string} oAuthClientID - The Google OAuth client ID.
   * @param {string} oAuthClientSecret - The Google OAuth client secret.
   * @param {string} oAuthRedirectUri - The Google OAuth redirect URI.
   * @returns None
   */
  if (
    !oAuthClientID ||
    !oAuthClientSecret ||
    !oAuthRedirectUri ||
    _.isElement(oAuthClientID) ||
    _.isEmpty(oAuthClientSecret) ||
    _.isEmpty(oAuthRedirectUri)
  ) {
    payload.msg = {
      error: true,
      message: "Missing required Google OAuth client credentials",
      statusCode: 400,
      missing: {
        clientId: _.isElement(oAuthClientID),
        clientSecret: _.isElement(oAuthClientSecret),
        redirectUri: _.isEmpty(oAuthRedirectUri),
      },
    };
    return;
  }

  /**
   * Creates a new OAuth2Client instance with the provided client ID, client secret, and redirect URI.
   * @param {string} oAuthClientID - The client ID for OAuth authentication.
   * @param {string} oAuthClientSecret - The client secret for OAuth authentication.
   * @param {string} oAuthRedirectUri - The redirect URI for OAuth authentication.
   * @returns {OAuth2Client} A new OAuth2Client instance.
   */
  const oAuth2Client = new Auth.OAuth2Client({
    clientId: oAuthClientID,
    clientSecret: oAuthClientSecret,
    redirectUri: oAuthRedirectUri,
  });

  /**
   * Destructures the inputs object to extract specific properties.
   * @param {object} inputs - The object containing input properties.
   * @returns None
   */
  const { access_type, prompt, scope, state, login_hint } = inputs;

  /**
   * Checks if the access_type and prompt parameters are missing or empty, and sets an error message in the payload object if they are.
   * @param {string} access_type - The access type parameter for Google OAuth.
   * @param {string} prompt - The prompt parameter for Google OAuth.
   * @param {object} payload - The payload object to update with the error message.
   * @returns None
   */
  if (!access_type || !prompt || _.isEmpty(access_type) || _.isEmpty(prompt)) {
    payload.msg = {
      error: true,
      message: "Missing required Google OAuth parameters",
      statusCode: 400,
      missing: {
        access_type: _.isEmpty(access_type),
        prompt: _.isEmpty(prompt),
      },
    };
    return;
  }

  /**
   * Generates an authorization URL for OAuth2Client with the provided parameters.
   * @param {Object} options - The options object containing access_type, scope, prompt, state, and login_hint.
   * @returns {string} The authorization URL generated for the OAuth2Client.
   */
  const authURL = oAuth2Client.generateAuthUrl({
    access_type,
    scope,
    prompt,
    state,
    login_hint,
  });

  /**
   * Assigns the authURL to the msg property of the payload object.
   * @param {string} authURL - The authentication URL to be assigned.
   * @returns None
   */
  payload.msg = {
    authURL,
  };

  /**
   * Calls the next function in the program flow.
   * @returns None
   */
  next();
}

export default generateGoogleAuthUrl;
