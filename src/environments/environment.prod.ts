import { Network } from '@app/shared/services/api.service';

export const environment = {
  production: true,
  baseURL: (net: Network) => `https://openapi.teamxi.cloud/api`,
  helperBaseURL: (net: Network) => `https://portal-helper-api.testnet.dvita.com`,
  wsURL: (net: Network) => `wss://portal-helper-api.testnet.dvita.com`,
  extensionDownloadURL: 'https://chrome.google.com/webstore/detail/dvita-wallet/nggheophiekocmlbklkefdenogendehj',
  filesUrl: 'https://static.dvita.com',
  fileUploadAwsUrl: 'https://ntf8xtf904.execute-api.eu-central-1.amazonaws.com/uploads',
  fileAwsBaseUrl: 'https://s3tantalisuploader-s3uploadbucket-135xglh7pwq91.s3.eu-central-1.amazonaws.com',
  timeZone: 'UTC',
  tokenHashDVG: '0xd2a4cff31913016155e38e474a2c06d08be276cf',
  tokenHashDVITA: '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5',
  dvgDecimals: 8,
};
