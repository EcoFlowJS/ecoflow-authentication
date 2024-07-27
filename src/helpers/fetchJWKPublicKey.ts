import stringIsAValidUrl from "./stringIsAValidUrl";
import jwksClient, { SigningKey } from "jwks-rsa";

/**
 * Fetches the JWK public key from the provided URL.
 * @param {string} url - The URL to fetch the JWK public key from.
 * @returns A Promise that resolves to a string or a function that takes in a header and a callback function.
 */
const fetchJWKPublicKey = async (
  url: string
): Promise<
  | string
  | ((
      header: any,
      callback: (err: Error | null, key?: SigningKey) => void
    ) => void)
> => {
  if (!stringIsAValidUrl(url)) return "";

  /**
   * Creates a new JWKS (JSON Web Key Set) client with the provided configuration options.
   * @param {string} url - The URL of the JWKS endpoint.
   * @returns A JWKS client instance.
   */
  const client = jwksClient({
    jwksUri: url,
    cache: true,
    cacheMaxEntries: 50,
    cacheMaxAge: 60 * 60 * 1000, // 1 hour cache duration
  });

  return (
    header: any,
    callback: (err: Error | null, key?: SigningKey) => void
  ) => {
    /**
     * Retrieves the signing key for the given key ID and invokes the callback function with the signing key.
     * @param {string} kid - The key ID used to retrieve the signing key.
     * @param {(err: Error | null, key?: SigningKey) => void} callback - The callback function to be invoked with the signing key.
     * @returns None
     */
    client.getSigningKey(header.kid, (err: Error | null, key?: SigningKey) => {
      //@ts-ignore
      const signingKey = key?.publicKey || key?.rsaPublicKey;
      callback(err, signingKey);
    });
  };
};

export default fetchJWKPublicKey;
