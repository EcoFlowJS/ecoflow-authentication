import { EcoContext } from "@ecoflow/types";
import axios from "axios";
import { Auth } from "googleapis";

export default async function getUserDetails(ctx: EcoContext) {
  const { _, moduleConfigs } = ecoFlow;

  const { payload, inputs, request, next } = ctx;

  if (!inputs || _.isEmpty(inputs)) {
    payload.msg = {
      error: true,
      message: "Missing inputs.",
    };
    return;
  }

  const { client, refreshToken, passByQuery, queryKey } = inputs;

  if (!client || _.isEmpty(client)) {
    payload.msg = {
      error: true,
      message: "Missing client.",
      status: {
        client: _.isUndefined(client),
      },
    };
    return;
  }

  const userRefreshToken: string = passByQuery
    ? queryKey
      ? request.query[queryKey]
      : request.query["token"]
    : refreshToken;

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
    OAuthClient.setCredentials({ refresh_token: userRefreshToken });
    const access_token = await OAuthClient.getAccessToken();
    if (_.isUndefined(access_token.token) || _.isNull(access_token.token))
      throw "Failed to get access token.";
    const userInfo = (
      await axios.get(
        `https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${access_token.token}`
      )
    ).data;

    payload.msg = {
      success: true,
      user: userInfo,
    };

    OAuthClient.credentials = {};

    next();
  } catch (error) {
    payload.msg = {
      error: true,
      message: "Failed to get user details.",
      rawError: error,
    };
    return;
  }
}
