import { ModuleManifest } from "@ecoflow/types";

const functionManifest: () => ModuleManifest = () => ({
  /**
   * Represents a function with the name "Function".
   * @type {string}
   */
  name: "Authentication",

  /**
   * List of specifications for different middleware types including Switch, Switch In, Range, and Function.
   * Each specification includes name, type, inputs, and controller.
   * @type {Array}
   */
  specs: [
    /**
     * Represents a middleware configuration object for signing JWT tokens.
     * @type {Object}
     * @property {string} name - The name of the middleware ("SignJWT").
     * @property {string} type - The type of middleware ("Middleware").
     * @property {Array} inputs - An array of input configurations for the middleware.
     * @property {string} inputs[].name - The name of the input field.
     * @property {string} inputs[].label - The label for the input field.
     * @property {string} inputs[].type - The type of input field.
     * @property {boolean} inputs[].required - Indicates if the input is required.
     * @property {string} inputs[].defaultValue - The default value for the input
     */
    {
      /**
       * Represents the name of a JWT signing algorithm.
       * @type {string}
       */
      name: "SignJWT",

      /**
       * Represents the type of a component as "Middleware".
       */
      type: "Middleware",

      /**
       * An array of input objects that define the configuration options for generating a token.
       * Each input object contains properties such as name, label, type, required, defaultValue, and additional hints.
       * @type {Array}
       */
      inputs: [
        /**
         * Represents a configuration object for a payload key.
         * @type {Object}
         * @property {string} name - The name of the payload key.
         * @property {string} label - The label for the payload key.
         * @property {string} type - The data type of the payload key.
         * @property {boolean} required - Indicates if the payload key is required.
         * @property {string} defaultValue - The default value for the payload key.
         */
        {
          name: "payloadKey",
          label: "Payload Key",
          type: "String",
          required: true,
          defaultValue: "msg",
        },

        /**
         * Represents a configuration object for a response key field.
         * @type {Object}
         * @property {string} name - The name of the response key field.
         * @property {string} label - The label to display for the response key field.
         * @property {string} type - The data type of the response key field.
         * @property {boolean} required - Indicates if the response key field is required.
         * @property {string} defaultValue - The default value for the response key field.
         */
        {
          name: "responseKey",
          label: "Response Key",
          type: "String",
          required: true,
          defaultValue: "msg",
        },

        /**
         * Represents a configuration object for setting expiration time.
         * @property {string} name - The name of the configuration field.
         * @property {string} label - The label to display for the field.
         * @property {string} type - The data type of the field.
         * @property {boolean} required - Indicates if the field is required.
         * @property {string} defaultValue - The default value for the field.
         */
        {
          name: "expiresIn",
          label: "Expiration Time",
          type: "String",
          required: true,
          defaultValue: "1hr",
        },

        /**
         * Represents a configuration object for an "Algorithm" field in a form.
         * @type {Object}
         * @property {string} name - The name of the field.
         * @property {string} label - The label displayed for the field.
         * @property {string} type - The type of input field (SelectPicker in this case).
         * @property {string[]} pickerOptions - The options available in the picker.
         * @property {boolean} required - Indicates if the field is required to be filled.
         */
        {
          name: "algorithm",
          label: "Algorithm",
          type: "SelectPicker",
          pickerOptions: ["HS256", "HS384", "RS256", "RS384"],
          required: true,
        },

        /**
         * Represents a configuration object for a secret or private key input field.
         * @type {Object}
         * @property {string} name - The name of the input field.
         * @property {string} label - The label displayed for the input field.
         * @property {string} type - The type of input field (e.g., String).
         * @property {string} hint - Additional information or hint for the input field.
         * @property {boolean} required - Indicates if the input field is required.
         */
        {
          name: "secretORprivateKey",
          label: "Enter the secret or private key",
          type: "String",
          hint: "Private key works only with RS256 and RS384",
          required: true,
        },

        /**
         * Represents a configuration object for fetching a secret or private key from the environment.
         * @type {Object}
         * @property {string} name - The name of the configuration option ("secretORprivateKeyFromEnvironment").
         * @property {string} label - The label displayed for the configuration option ("Fetch the secret or private key from Environment").
         * @property {string} type - The type of input field for the configuration option ("Checkbox").
         * @property {string} hint - Additional information or instructions for the configuration option.
         */
        {
          name: "secretORprivateKeyFromEnvironment",
          label: "Fetch the secret or private key from Environment",
          type: "Checkbox",
          hint: 'For environment variables provide EcoFlow prefix. example:"ECOFLOW_USER_"',
        },
      ],

      /**
       * The controller responsible for signing JSON Web Tokens (JWT).
       * @type {string}
       */
      controller: "signJWTController",
    },

    /**
     * Represents a configuration object for JWT JWKS Public Key middleware.
     * @type {Object}
     * @property {string} name - The name of the middleware.
     * @property {string} type - The type of middleware.
     * @property {Array<Object>} inputs - An array of input objects for the middleware.
     * @property {string} inputs[].name - The name of the input.
     * @property {string} inputs[].label - The label for the input.
     * @property {string} inputs[].type - The type of the input.
     * @property {boolean} inputs[].required - Indicates if the input is required.
     * @property {string} inputs[].defaultValue - The default value for the input.
     * @property
     */
    {
      /**
       * Represents the name of a JWT JWKS Public Key.
       * @type {string}
       */
      name: "JWT JWKS Public Key",

      /**
       * Represents the type of a component as "Middleware".
       */
      type: "Middleware",

      /**
       * An array of input objects that can be used to configure a specific functionality.
       * @type {Array}
       * @property {string} name - The name of the input.
       * @property {string} label - The label to display for the input.
       * @property {string} type - The type of input (e.g., String, Checkbox).
       * @property {string} hint - Additional information or instructions for the input.
       * @property {boolean} required - Indicates if the input is required.
       * @property {string} defaultValue - The default value for the input (if applicable).
       */
      inputs: [
        /**
         * Represents a configuration object for a response key field.
         * @type {Object}
         * @property {string} name - The name of the response key field.
         * @property {string} label - The label to display for the response key field.
         * @property {string} type - The data type of the response key field.
         * @property {boolean} required - Indicates if the response key field is required.
         * @property {string} defaultValue - The default value for the response key field.
         */
        {
          name: "responseKey",
          label: "Response Key",
          type: "String",
          required: true,
          defaultValue: "msg",
        },

        /**
         * Represents a form field configuration object for entering a public key.
         * @type {Object}
         * @property {string} name - The name of the field ("publicKey").
         * @property {string} label - The label displayed for the field ("Enter the Public Key").
         * @property {string} type - The type of the field ("String").
         * @property {string} hint - Additional hint for the field ("RS256 and RS384 public key").
         * @property {boolean} required - Indicates if the field is required (true).
         */
        {
          name: "publicKey",
          label: "Enter the Public Key",
          type: "String",
          hint: "RS256 and RS384 public key",
          required: true,
        },

        /**
         * Represents a configuration option for fetching the public key from an environment variable.
         * @type {Object}
         * @property {string} name - The name of the configuration option ("fromEnvironmentVariable").
         * @property {string} label - The label displayed for the option ("Fetch the public key from Environment").
         * @property {string} type - The type of input field for the option ("Checkbox").
         * @property {string} hint - Additional information or instructions for the option
         * regarding environment variables and EcoFlow prefix.
         */
        {
          name: "fromEnvironmentVariable",
          label: "Fetch the public key from Environment",
          type: "Checkbox",
          hint: 'For environment variables provide EcoFlow prefix. example:"ECOFLOW_USER_"',
        },
      ],

      /**
       * The controller responsible for handling JWT JWKS (JSON Web Key Set) operations.
       * Value: "jwtJWKSController"
       */
      controller: "jwtJWKSController",
    },

    /**
     * Represents an authentication middleware that authenticates JWT tokens.
     * @type {Object}
     * @property {string} name - The name of the middleware ("Authenticate JWT").
     * @property {string} type - The type of middleware ("Middleware").
     * @property {Array} inputs - An array of input objects containing details about the inputs required for authentication.
     * @property {string} inputs[].name - The name of the input.
     * @property {string} inputs[].label - The label for the input.
     * @property {string} inputs[].type - The type of input.
     * @property {boolean} inputs[].required - Indicates if the input is required.
     * @property {string} inputs[].defaultValue - The default value for
     */
    {
      /**
       * Represents the name of the authentication method as "Authenticate JWT".
       */
      name: "Authenticate JWT",

      /**
       * Represents the type of a component as "Middleware".
       */
      type: "Middleware",

      /**
       * An array of input objects that define the configuration options for a specific task.
       * @type {Array}
       * @property {string} name - The name of the input field.
       * @property {string} label - The label displayed for the input field.
       * @property {string} type - The type of input field (String, SelectPicker, Radio, Checkbox, etc.).
       * @property {Array} [pickerOptions] - The options available for selection in a SelectPicker type.
       * @property {Array} [radioValues] - The values available for selection in a Radio type.
       * @property {string} [hint] - Additional information or instructions for the input field.
       * @property {boolean} required -
       */
      inputs: [
        /**
         * Represents a configuration object for a response key field.
         * @type {Object}
         * @property {string} name - The name of the response key field.
         * @property {string} label - The label to display for the response key field.
         * @property {string} type - The data type of the response key field.
         * @property {boolean} required - Indicates if the response key field is required.
         * @property {string} defaultValue - The default value for the response key field.
         */
        {
          name: "responseKey",
          label: "Response Key",
          type: "String",
          required: true,
          defaultValue: "msg",
        },

        /**
         * Represents a configuration object for an "Algorithm" field in a form.
         * @type {Object}
         * @property {string} name - The name of the field.
         * @property {string} label - The label displayed for the field.
         * @property {string} type - The type of input field (SelectPicker in this case).
         * @property {string[]} pickerOptions - The options available in the picker.
         * @property {boolean} required - Indicates if the field is required.
         */
        {
          name: "algorithm",
          label: "Algorithm",
          type: "SelectPicker",
          pickerOptions: ["HS256", "HS384", "RS256", "RS384"],
          required: true,
        },

        /**
         * Represents a radio button selector for choosing between a secret or private key.
         * @type {Object}
         * @property {string} name - The name of the selector.
         * @property {string} label - The label displayed next to the selector.
         * @property {string} type - The type of input element, in this case, "Radio".
         * @property {string[]} radioValues - An array of possible values for the radio button.
         * @property {string} defaultValue - The default value selected, in this case, "secret".
         * @property {boolean} required - Indicates whether the selection is required.
         */
        {
          name: "secretORprivateKeySelector",
          label: "Select the secret or private key",
          type: "Radio",
          radioValues: ["secret", "publicKey"],
          defaultValue: "secret",
          required: true,
        },

        /**
         * Represents a form field for entering a secret or public key.
         * @type {Object}
         * @property {string} name - The name of the field ("secretORpublicKey").
         * @property {string} label - The label displayed for the field ("Enter the secret or public key").
         * @property {string} type - The type of input field ("String").
         * @property {string} hint - Additional hint text for the field ("Public key works only with RS256 and RS384").
         * @property {boolean} required - Indicates if the field is required (true).
         */
        {
          name: "secretORpublicKey",
          label: "Enter the secret or public key",
          type: "String",
          hint: "Public key works only with RS256 and RS384",
          required: true,
        },

        /**
         * Represents a configuration option for fetching a secret or public key from an environment variable.
         * @type {Object}
         * @property {string} name - The name of the configuration option ("fromEnvironmentVariable").
         * @property {string} label - The label displayed for the option ("Fetch the secret or public key from Environment").
         * @property {string} type - The type of input element for the option ("Checkbox").
         * @property {string} hint - Additional information or instructions for the option ("For environment variables provide EcoFlow prefix. example:"ECOFLOW_USER_"").
         */
        {
          name: "fromEnvironmentVariable",
          label: "Fetch the secret or public key from Environment",
          type: "Checkbox",
          hint: 'For environment variables provide EcoFlow prefix. example:"ECOFLOW_USER_"',
        },
      ],

      /**
       * The controller responsible for authenticating a token.
       */
      controller: "authenticateTokenController",
    },

    {
      name: "Generate Google Auth URL",
      type: "Middleware",
      inputs: [
        {
          name: "clientId",
          label: "Client ID",
          type: "String",
          required: true,
          hint: 'For environment variables provide EcoFlow prefix. example:"ECOFLOW_USER_"',
        },
        {
          name: "clientIdFromEnv",
          label: "Client ID from Environment",
          type: "Checkbox",
          hint: "Use environment variable for client ID",
        },
        {
          name: "clientSecret",
          label: "Client Secret",
          type: "String",
          required: true,
          hint: 'For environment variables provide EcoFlow prefix. example:"ECOFLOW_USER_"',
        },
        {
          name: "clientSecretFromEnv",
          label: "Client Secret from Environment",
          type: "Checkbox",
          hint: "Use environment variable for client secret",
        },
        {
          name: "redirectUri",
          label: "Redirect URI",
          type: "String",
          required: true,
          hint: 'For environment variables provide EcoFlow prefix. example:"ECOFLOW_USER_"',
        },
        {
          name: "redirectUriFromEnv",
          label: "Redirect URI from Environment",
          type: "Checkbox",
          hint: "Use environment variable for redirect URI",
        },
        {
          name: "access_type",
          label: "Auth URL Access Type",
          type: "SelectPicker",
          pickerOptions: ["online", "offline"],
          required: true,
          defaultValue: "online",
        },
        {
          name: "prompt",
          label: "Auth URL Prompt",
          type: "SelectPicker",
          pickerOptions: ["select_account", "consent", "none"],
          required: true,
          defaultValue: "consent",
        },
        {
          name: "scope",
          label: "Scopes",
          type: "ListBox",
        },
        {
          name: "state",
          label: "State",
          type: "String",
          hint: "An optional state parameter to maintain state between the request and the callback",
        },
        {
          name: "login_hint",
          label: "Login Hint",
          type: "String",
          hint: "An optional login hint to pre-fill the email field in the consent screen",
        },
      ],
      controller: "generateGoogleAuthUrl",
    },
    {
      name: "Google Authenticate",
      type: "Middleware",
      inputs: [
        {
          name: "clientId",
          label: "Client ID",
          type: "String",
          required: true,
          hint: 'For environment variables provide EcoFlow prefix. example:"ECOFLOW_USER_"',
        },
        {
          name: "clientIdFromEnv",
          label: "Client ID from Environment",
          type: "Checkbox",
          hint: "Use environment variable for client ID",
        },
        {
          name: "clientSecret",
          label: "Client Secret",
          type: "String",
          required: true,
          hint: 'For environment variables provide EcoFlow prefix. example:"ECOFLOW_USER_"',
        },
        {
          name: "clientSecretFromEnv",
          label: "Client Secret from Environment",
          type: "Checkbox",
          hint: "Use environment variable for client secret",
        },
        {
          name: "redirectUri",
          label: "Redirect URI",
          type: "String",
          required: true,
          hint: 'For environment variables provide EcoFlow prefix. example:"ECOFLOW_USER_"',
        },
        {
          name: "redirectUriFromEnv",
          label: "Redirect URI from Environment",
          type: "Checkbox",
          hint: "Use environment variable for redirect URI",
        },
      ],
      controller: "googleOAuthAuthenticate",
    },
  ],
});

export default functionManifest;
