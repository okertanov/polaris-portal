import { Network } from '@app/shared/services/api.service';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseURL: (net: Network) => `https://openapi.testnet.dvita.com/api`,
  helperBaseURL: (net: Network) => `http://localhost:5000`,
  wsURL: (net: Network) => `ws://localhost:5001`,
  extensionDownloadURL: 'https://chrome.google.com/webstore/detail/dvita-wallet/nggheophiekocmlbklkefdenogendehj',
  filesUrl: 'https://static.dvita.com',
  fileUploadAwsUrl: 'https://ntf8xtf904.execute-api.eu-central-1.amazonaws.com/uploads',
  fileAwsBaseUrl: 'https://s3tantalisuploader-s3uploadbucket-135xglh7pwq91.s3.eu-central-1.amazonaws.com',
  timeZone: 'UTC',
  tokenHashDVG: '0xd2a4cff31913016155e38e474a2c06d08be276cf',
  tokenHashDVITA: '0xb34e1025391e953a918231df11478ec21b039e5f',
  dvgDecimals: 8,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
