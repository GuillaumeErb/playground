import {
  AccountInfo,
  Configuration,
  InteractionRequiredAuthError,
  IPublicClientApplication,
  LogLevel,
} from '@azure/msal-browser';

export const CLIENT_ID = '58ed5d5d-5ab0-4c43-9f3c-824247c1892c';
const DEFAULT_AUTHORITY = 'https://login.microsoftonline.com/common';
const REDIRECT_URI = 'http://localhost:5165';
export const TENANT_ID = '39978ec3-287e-4574-8c31-93c1151c1bb6';

export const msalConfig: Configuration = {
  auth: {
    clientId: CLIENT_ID,
    authority: DEFAULT_AUTHORITY,
    redirectUri: REDIRECT_URI,
  },
  cache: {
    cacheLocation: 'sessionStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
    },
  },
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scopes: ['User.Read'],
};

export const acquireToken = async (
  msalInstance: IPublicClientApplication,
  scopes: string[],
  account: AccountInfo,
  authority: string
) => {
  try {
    return await msalInstance.acquireTokenSilent({
      scopes,
      account,
      authority,
    });
  } catch (e: unknown) {
    if (e instanceof InteractionRequiredAuthError) {
      // fallback to interaction when silent call fails
      return await msalInstance.acquireTokenPopup({
        scopes,
        account,
        authority,
      });
    }
    console.error(e);
    throw e;
  }
};

export const getAccessToken = async (
  msalInstance: IPublicClientApplication,
  scopes: string[],
  account: AccountInfo,
  authority: string = DEFAULT_AUTHORITY
) => (await acquireToken(msalInstance, scopes, account, authority)).accessToken;
