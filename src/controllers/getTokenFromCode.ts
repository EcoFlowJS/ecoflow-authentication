import { EcoContext } from "@ecoflow/types";
import { Auth, google } from "googleapis";

export default async function getTokenFromCode(ctx: EcoContext) {
  const { _, moduleConfigs } = ecoFlow;

  const { payload, inputs, next } = ctx;

  if (!inputs || _.isEmpty(inputs)) {
    payload.msg = {
      error: true,
      message: "Missing inputs.",
    };
    return;
  }

  const { client, code, passByPayload, payloadKey } = inputs;

  if (!client || _.isEmpty(client)) {
    payload.msg = {
      error: true,
      message: "Missing client.",
      status: {
        client: _.isUndefined(client),
        code: _.isUndefined(code),
        passByPayload: _.isUndefined(passByPayload),
        payloadKey: _.isUndefined(payloadKey),
      },
    };
    return;
  }

  const userCode = passByPayload
    ? payloadKey
      ? payload[payloadKey].code
      : payload.msg.code
    : code;

  const configManager = moduleConfigs.selectPackage("ecoflow-authentication");
  if (!configManager || _.isUndefined(configManager)) {
    payload.msg = {
      error: true,
      message: "Missing configs manager for ecoflow-authentication package",
    };
    return;
  }

  const config = configManager.get(client);
  if (_.isNull(config) || _.isEmpty(config)) {
    payload.msg = {
      error: true,
      message: "Missing config for ecoflow-authentication package",
    };
    return;
  }

  const OAuthClient = config.configs as Auth.OAuth2Client;
  if (_.isNull(OAuthClient) || _.isEmpty(OAuthClient)) {
    payload.msg = {
      error: true,
      message: "Missing OAuth client",
    };
    return;
  }

  try {
    const token = await OAuthClient.getToken(userCode);

    payload.msg = {
      success: true,
      token: token.tokens,
      accessToken: token.tokens.access_token,
      refreshToken: token.tokens.refresh_token,
    };
  } catch (error) {
    payload.msg = {
      error: true,
      message: `Failed to get token from code: ${code}`,
      rawError: error,
    };
    return;
  }

  next();
}
