import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutService } from './layouts/main-layout/main-layout.service';

// tslint:disable: max-line-length

// prettier-ignore
const routes: Routes = [
  { path: '', redirectTo: '/assets/deploy', pathMatch: 'full' },
  MainLayoutService.childRoutes([
    { path: '', loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingModule) },
    /** Main sections */
    { path: 'node-election', loadChildren: () => import('./pages/node-election/node-election.module').then(m => m.NodeElectionModule) },
    { path: 'applications', loadChildren: () => import('./pages/applications/applications.module').then(m => m.ApplicationsModule) },
    { path: 'assets', loadChildren: () => import('./pages/assets/assets.module').then(m => m.AssetsModule) },
    { path: 'verify', loadChildren: () => import('./pages/verify/verify.module').then(m => m.VerifyModule) },
    { path: 'create-transaction', loadChildren: () => import('./pages/create-transaction/create-transaction.module').then(m => m.CreateTransactionModule) },
    { path: 'multisig-wallet', loadChildren: () => import('./pages/multisig-wallet/multisig-wallet.module').then(m => m.MultisigWalletModule) },
    { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
    { path: 'wallet', loadChildren: () => import('./pages/wallet/wallet.module').then(m => m.WalletModule) },

    /** Blogs Group */
    { path: 'blogs', loadChildren: () => import('./pages/blog-list/blog-list.module').then(m => m.BlogListModule) },
    { path: 'blog', loadChildren: () => import('./pages/blog/blog.module').then(m => m.BlogModule) },

    /** Partners Group */
    { path: 'our-partners', loadChildren: () => import('./pages/partners/our-partners/our-partners.module').then(m => m.OurPartnersModule) },
    { path: 'become-our-partner', loadChildren: () => import('./pages/partners/becom-our-partner/becom-our-partner.module').then(m => m.BecomOurPartnerModule) },

    /** About us Group */
    { path: 'team', loadChildren: () => import('./pages/about-us/team/team.module').then(m => m.TeamModule) },
    { path: 'careers', loadChildren: () => import('./pages/about-us/careers/careers.module').then(m => m.CareersModule) },
    { path: 'compliance', loadChildren: () => import('./pages/about-us/compliance/compliance.module').then(m => m.ComplianceModule) },
    { path: 'faq', loadChildren: () => import('./pages/about-us/faq/faq.module').then(m => m.FaqModule) },
    { path: 'terms', loadChildren: () => import('./pages/terms/terms.module').then(m => m.TermsModule) },
    { path: 'policy', loadChildren: () => import('./pages/policy/policy.module').then(m => m.PolicyModule) },
    { path: 'license', loadChildren: () => import('./pages/license/license.module').then(m => m.LicenseModule) },
    { path: 'build-now', loadChildren: () => import('./pages/build-now/build-now.module').then(m => m.BuildNowModule) },


    /** Explorer Group */
    { path: 'blocks', loadChildren: () => import('./pages/explorer/blocks/blocks.module').then(m => m.BlocksModule) },
    { path: 'transactions', loadChildren: () => import('./pages/explorer/transactions/transactions.module').then(m => m.TransactionsModule) },
    { path: 'contracts', loadChildren: () => import('./pages/explorer/contracts/contracts.module').then(m => m.ContractsModule) },
    { path: 'monitor', loadChildren: () => import('./pages/explorer/monitor/monitor.module').then(m => m.MonitorModule) },
    { path: 'statistics', loadChildren: () => import('./pages/explorer/statistics/statistics.module').then(m => m.StatisticsModule) },

    /* Social Callbacks */
    { path: 'social/welcome', loadChildren: () => import('./pages/social/welcome/social-welcome.module').then(m => m.SocialWelcomeModule) },
  ])
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
