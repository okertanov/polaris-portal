import { Injectable } from '@angular/core';

export interface AppData {
  logo: string;
  name: string;
  description: string;
  link?: string;
  devBy?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApplicationsService {
  appsList: AppData[] = [
    {
      logo: 'assets/imgs/applications/dVITA-Custody-wallet.png',
      name: 'dVITA Custody Wallet',
      link: 'https://foundation.dvita.com/login',
      devBy: 'dVITA Labs',
      description:
        'dVITA custody wallet for many different digital assets. Multi-signature, key backups, validations and many more features.',
    },
    {
      logo: 'assets/imgs/applications/xDARO.png',
      name: 'xDaro Custody',
      link: 'https://xdaro.com/',
      devBy: 'Team11.it',
      description: 'Custody wallet for instant DLT asset control. Supporting many DLT asset types',
    },
    {
      logo: 'assets/imgs/applications/mintgo.png',
      name: 'MintGo',
      link: 'https://mintgo.staging.team11.lv/',
      devBy: ' dVITA Labs',
      description: 'NFT marketplace. Discover, collect, and sell extraordinary NFTs',
    },
    {
      logo: 'assets/imgs/applications/dVITA-Light-wallet.png',
      name: 'dVITA Light Wallet',
      link: 'https://foundation.dvita.com/login',
      devBy: 'dVITA Labs',
      description: 'An open-source cross-platform light wallet for the dVITA blockchain',
    },
    {
      logo: 'assets/imgs/applications/premiabanx.png',
      name: 'PremiaBanx',
      link: 'https://www.premiabanx.com/',
      devBy: 'Premiabanx',
      description:
        'PremiaBanx is a FinTech corporation specializing in digital payment systems and turnkey solutions for enterprises',
    },
    {
      logo: 'assets/imgs/applications/Make-Exchange.png',
      name: 'make.exchange',
      link: 'https://make.exchange/',
      devBy: 'make.exchange',
      description: 'Instant Crypto and DLT asset exchange',
    },
    {
      logo: 'assets/imgs/applications/lyopay.png',
      name: 'Lyopay',
      link: 'https://lyopay.com/',
      devBy: 'LYOPAY',
      description:
        'LYOPAY is a Super App that integrates many day-to-day services, such as payments, e-commerce, travel booking, and many more',
    },
    {
      logo: 'assets/imgs/applications/bankomia.svg',
      name: 'Bankomia',
      link: 'https://bankomia.com/',
      devBy: 'Bankomia',
      description: 'Application which connects crypto and fiat world',
    },
    {
      logo: 'assets/imgs/applications/exchange.svg',
      name: 'ExchangeGate',
      link: 'https://exchange-gate.io/',
      devBy: 'Exchange Gate',
      description: 'The most advanced API solution to connect with Blockchain protocols and DLT asset exchanges',
    },
    {
      logo: 'assets/imgs/applications/bestcoininvestments.png',
      name: 'Bestcoininvestments',
      link: 'http://bestcoininvestments.com',
      devBy: 'Team11.it',
      description: 'Featured DLT asset News portal',
    },
  ];

  constructor() {}
}
