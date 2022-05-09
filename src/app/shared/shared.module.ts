import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
/** Material modules */
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { AboutUsComponent } from './components/big-menu/about-us/about-us.component';
/** Big Menu Components */
import { BigMenuComponent } from './components/big-menu/big-menu.component';
import { DeveloperComponent } from './components/big-menu/developer/developer.component';
import { DvitaComponent } from './components/big-menu/dvita/dvita.component';
import { EnterpriseComponent } from './components/big-menu/enterprise/enterprsie.component';
import { ExplorerComponent } from './components/big-menu/explorer/explorer.component';
import { PartnersComponent } from './components/big-menu/partners/partners.component';
import { PlatformComponent } from './components/big-menu/platform/platform.component';
import { DetailsTitleComponent } from './components/details-title/details-title.component';
import { DropdownMenuComponent } from './components/dropdown-menu/dropdown-menu.component';
import { ExtensionsTitleComponent } from './components/extensions-title/extensions-title.component';
/** Components */
import { HeaderComponent } from './components/header/header.component';
import { NetworkSelectComponent } from './components/network-select/network-select.component';
import { FooterComponent } from './components/new-footer/new-footer.component';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { SearchComponent } from './components/search/search.component';
import { SubTitleComponent } from './components/sub-title/sub-title.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { ExpansionComponent } from './modals/expansion/expansion.component';
import { MessageTitleComponent } from './modals/message/message-title/message-title.component';
import { MessageComponent } from './modals/message/message.component';
import { VotingComponent } from './modals/voting/voting.component';
import { MomentPipePipe } from './pipes/moment-pipe.pipe';
import { NoWhiteSpacePipe } from './pipes/no-white-space.pipe';
import { SanitizePipe } from './pipes/sanitize.pipe';
import { ToCamelCasePipe } from './pipes/toCamelCase.pipe';
import { WalletProviderDvitaWebPopupConfirmComponent } from './services/wallet/wallet-provider-dvita-web-popup-confirm.component';
import { WalletProviderDvitaWebPopupDestroyComponent } from './services/wallet/wallet-provider-dvita-web-popup-destroy.component';
import { WalletProviderDvitaWebPopupImportComponent } from './services/wallet/wallet-provider-dvita-web-popup-import.component';
import { WalletProviderDvitaWebPopupUnlockComponent } from './services/wallet/wallet-provider-dvita-web-popup-unlock.component';

@NgModule({
  exports: [
    MatSliderModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatTabsModule,
    MatIconModule,
    MatExpansionModule,
    MatMenuModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSelectModule,
    MatRadioModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
})
export class MaterialModule {}

@NgModule({
  declarations: [
    /** shared Components */
    HeaderComponent,
    FooterComponent,
    PaginatorComponent,
    PageTitleComponent,
    MessageTitleComponent,
    SubTitleComponent,
    DetailsTitleComponent,
    ExtensionsTitleComponent,
    TopBarComponent,

    /** Big Menu Components */
    BigMenuComponent,
    DvitaComponent,
    EnterpriseComponent,
    PlatformComponent,
    ExplorerComponent,
    DeveloperComponent,
    PartnersComponent,
    AboutUsComponent,

    /** Modals components */
    VotingComponent,
    MessageComponent,
    ExpansionComponent,

    MomentPipePipe,
    ToCamelCasePipe,
    SanitizePipe,
    DropdownMenuComponent,
    NetworkSelectComponent,
    SearchComponent,
    WalletProviderDvitaWebPopupConfirmComponent,
    WalletProviderDvitaWebPopupUnlockComponent,
    WalletProviderDvitaWebPopupDestroyComponent,
    WalletProviderDvitaWebPopupImportComponent,
    NoWhiteSpacePipe,
  ],
  imports: [CommonModule, RouterModule, MaterialModule, FormsModule],
  exports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
    PaginatorComponent,
    PageTitleComponent,
    MessageTitleComponent,
    SubTitleComponent,
    DetailsTitleComponent,
    ExtensionsTitleComponent,
    TopBarComponent,

    /** Big Menu Components */
    BigMenuComponent,
    ExplorerComponent,
    DeveloperComponent,
    PartnersComponent,
    AboutUsComponent,

    VotingComponent,
    MessageComponent,
    ExpansionComponent,

    ToCamelCasePipe,
    SanitizePipe,
    DropdownMenuComponent,
    NetworkSelectComponent,
    SearchComponent,
    MomentPipePipe,
    NoWhiteSpacePipe,
  ],
})
export class SharedModule {}
