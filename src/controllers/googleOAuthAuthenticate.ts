import { EcoContext } from "@ecoflow/types";
import { Auth, oauth2_v2 } from "googleapis";

async function generateGoogleAuthUrl(this: EcoContext) {
  const { _, log } = ecoFlow;

  const { payload, inputs, next, request } = this;

  if (_.isUndefined(inputs)) return;

  const {
    clientId,
    clientIdFromEnv,
    clientSecret,
    clientSecretFromEnv,
    redirectUri,
    redirectUriFromEnv,
  } = inputs;

  const oAuthClientID = clientIdFromEnv ? process.env[clientId] : clientId;

  const oAuthClientSecret = clientSecretFromEnv
    ? process.env[clientSecret]
    : clientSecret;

  const oAuthRedirectUri = redirectUriFromEnv
    ? process.env[redirectUri]
    : redirectUri;

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

  const oAuth2Client = new Auth.OAuth2Client({
    clientId: oAuthClientID,
    clientSecret: oAuthClientSecret,
    redirectUri: oAuthRedirectUri,
  });

  const code = request.query.code as string;

  if (!code || _.isEmpty(code)) {
    payload.msg = {
      error: true,
      message: "Missing Google OAuth authorization code",
      statusCode: 400,
    };
    return;
  }

  const oAuthGetTokensResponse = await oAuth2Client.getToken(code);
  await oAuth2Client.setCredentials(oAuthGetTokensResponse.tokens);

  const resource$Userinfo = new oauth2_v2.Resource$Userinfo({
    _options: { auth: oAuth2Client },
  });

  const { data } = await resource$Userinfo.get();

  payload.msg = {
    error: false,
    message: "Google OAuth authentication successful",
    statusCode: 200,
    user: data,
  };

  next();
}

export default generateGoogleAuthUrl;
