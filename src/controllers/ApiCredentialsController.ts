import { Auth } from "googleapis";

export default function ApiCredentialsController(inputs: any) {
  const { _, log } = ecoFlow;

  if (_.isEmpty(inputs)) {
    log.error("Missing inputs.");
    return null;
  }

  const { clientId, clientSecret, redirectUri } = inputs;

  if (!clientId || _.isEmpty(clientId)) {
    log.error("Missing project URL.");
    return null;
  }

  if (!clientSecret || _.isEmpty(clientSecret)) {
    log.error("Missing project URL.");
    return null;
  }

  return new Auth.OAuth2Client({
    clientId,
    clientSecret,
    redirectUri,
  });
}
