import { EcoContext } from "@ecoflow/types";
import { Auth, oauth2_v2 } from "googleapis";

/**
 * Generates a Google OAuth URL for authentication using the provided EcoContext.
 * @param {EcoContext} ctx - The EcoContext object containing necessary information for authentication.
 * @returns None
 */
async function generateGoogleAuthUrl(ctx: EcoContext) {
  const { _ } = ecoFlow;

  /**
   * Destructures the context object to extract payload, inputs, next, and request.
   * @param {object} ctx - The context object containing payload, inputs, next, and request.
   * @returns None
   */
  const { payload, inputs, next, request } = ctx;

  /**
   * Checks if the inputs variable is undefined and returns early if it is.
   * @param {any} inputs - The variable to check for undefined.
   * @returns None
   */
  if (_.isUndefined(inputs)) return;

  /**
   * Destructures the inputs object to extract clientId, clientIdFromEnv, clientSecret,
   * clientSecretFromEnv, redirectUri, and redirectUriFromEnv.
   * @param {object} inputs - The object containing input values.
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
   * @param {boolean} clientIdFromEnv - Flag to determine if the client ID should be retrieved from environment variables.
   * @param {string} clientId - The default client ID to use if clientIdFromEnv is false.
   * @returns The OAuth client ID to be used.
   */
  const oAuthClientID = clientIdFromEnv ? process.env[clientId] : clientId;

  /**
   * Retrieves the OAuth client secret from the environment variable if available,
   * otherwise uses the provided client secret.
   * @param {string} clientSecretFromEnv - The environment variable name for the client secret.
   * @param {string} clientSecret - The default client secret to use if not found in the environment.
   * @returns The OAuth client secret to be used.
   */
  const oAuthClientSecret = clientSecretFromEnv
    ? process.env[clientSecret]
    : clientSecret;

  /**
   * Sets the OAuth redirect URI based on the value from the environment variable or a default value.
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
   * @param {string} oAuthRedirectUri - The OAuth redirect URI.
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
   * Creates a new OAuth2Client instance with the provided configuration.
   * @param {Object} config - The configuration object for the OAuth2Client.
   * @param {string} config.clientId - The client ID for OAuth authentication.
   * @param {string} config.clientSecret - The client secret for OAuth authentication.
   * @param {string} config.redirectUri - The redirect URI for OAuth authentication.
   * @returns {OAuth2Client} A new instance of OAuth2Client with the provided configuration.
   */
  const oAuth2Client = new Auth.OAuth2Client({
    clientId: oAuthClientID,
    clientSecret: oAuthClientSecret,
    redirectUri: oAuthRedirectUri,
  });

  /**
   * Extracts the 'code' parameter from the request query and casts it as a string.
   * @param {string} request.query.code - The 'code' parameter from the request query.
   * @returns The 'code' parameter as a string.
   */
  const code = request.query.code as string;

  /**
   * Checks if the provided code is empty or falsy. If it is, sets an error message in the payload object.
   * @param {string} code - The code to be checked for emptiness.
   * @returns None
   */
  if (!code || _.isEmpty(code)) {
    payload.msg = {
      error: true,
      message: "Missing Google OAuth authorization code",
      statusCode: 400,
    };
    return;
  }

  /**
   * Retrieves OAuth tokens using the provided authorization code and sets the credentials for the OAuth2 client.
   * @param {string} code - The authorization code used to get tokens.
   * @returns None
   */
  const oAuthGetTokensResponse = await oAuth2Client.getToken(code);
  await oAuth2Client.setCredentials(oAuthGetTokensResponse.tokens);

  /**
   * Creates a new instance of the Resource$Userinfo class with the provided options.
   * @param {Object} options - The options object containing the authentication client.
   * @returns A new instance of the Resource$Userinfo class.
   */
  const resource$Userinfo = new oauth2_v2.Resource$Userinfo({
    _options: { auth: oAuth2Client },
  });

  /**
   * Asynchronously retrieves user information data using the resource$Userinfo API.
   * @returns A Promise that resolves to an object containing the user information data.
   */
  const { data } = await resource$Userinfo.get();

  /**
   * Assigns an object to the 'msg' property of the 'payload' object with error status, message,
   * status code, and user data.
   * @param {object} payload - The payload object to assign the message object to.
   * @param {boolean} error - The error status of the message.
   * @param {string} message - The message content.
   * @param {number} statusCode - The status code of the message.
   * @param {object} user - The user data to include in the message.
   * @returns None
   */
  payload.msg = {
    error: false,
    message: "Google OAuth authentication successful",
    statusCode: 200,
    user: data,
  };

  /**
   * Calls the next function in the sequence.
   * @returns None
   */
  next();
}

export default generateGoogleAuthUrl;
