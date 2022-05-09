import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { environment } from '@app/../environments/environment';
import { AssetData, FormTypesData } from '@app/pages/assets/assets.interface';
import { AssetsService } from '@app/pages/assets/assets.service';
import { AuthService, User } from '@app/shared/services/auth.service';
import { SnackBarService } from '@app/shared/services/snack-bar.service';
import { TransactionService } from '@app/shared/services/transaction.service';
import { WalletPluginService } from '@app/shared/services/wallet/wallet.plugin.service';
import { from, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, startWith, takeUntil, tap } from 'rxjs/operators';

const tokenPaymentRecipient = 'NZJsKhsKzi9ipzjC57zU53EVMC97zqPDKG';
const tokenPaymentAmount = '500000000'; // 5 DVG (with 8 decimals)

@Component({
  selector: 'app-assets-manager',
  templateUrl: './assets-manager.component.html',
  styleUrls: ['./assets-manager.component.scss'],
})
export class AssetsManagerComponent implements OnInit, OnDestroy {
  assetsForm: FormGroup | undefined;

  assetsList: AssetData[] = [];
  assetsDisplayedColumns: string[] = ['name', 'code', 'type', 'hash', 'createdOn'];
  assetsDataSource!: MatTableDataSource<AssetData>;
  dataLength = 0;
  pageSizeOption: number[] = [10, 15, 30, 50];
  pageSize: number = this.pageSizeOption[0];
  pageIndex = 1;

  formTypes: FormTypesData[];
  formState: 'idle' | 'waitingForPayment' | 'waitingForConfirmation' = 'idle';

  loadCounter = 0;
  counterInterval: NodeJS.Timeout | undefined;

  formType$: Observable<string> | undefined = from('token');
  submitType = '';
  submitBtnName = '';

  private user: User | null = null;
  private completedForm: AbstractControl | null | undefined;
  private readonly destroy$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private assetsService: AssetsService,
    private authService: AuthService,
    private readonly walletPluginService: WalletPluginService,
    private readonly transactionService: TransactionService,
    private snackBarService: SnackBarService
  ) {
    this.formTypes = assetsService.formTypesData;
    this.assetsForm = assetsService.form;
  }

  ngOnInit(): void {
    // TODO: Unsubscribe when subscribed
    this.authService.userObservable.subscribe(user => (this.user = user));

    this.getAssets();
    this.listenType();
    this.dataLength = this.assetsList.length;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  get tokenForm(): { [key: string]: AbstractControl } {
    const form = this.assetsForm?.get('token') as FormGroup;
    return form?.controls;
  }

  get nftForm(): { [key: string]: AbstractControl } {
    const form = this.assetsForm?.get('nft') as FormGroup;
    return form?.controls;
  }

  goContract(row: AssetData): void {
    this.router.navigateByUrl(`/assets/${row.scriptHash}`);
  }

  pageChange(page: { pageIndex: number; pageSize: number }): void {
    console.log(page);
  }

  fileUpload(e: Event, formType: 'token' | 'nft'): void {
    const target = e.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    this.assetsService.uploadToAws(file, formType);
  }

  submitForm(): void {
    if (!this.user) {
      return this.snackBarService.show('Please log in first');
    }

    this.completedForm?.markAllAsTouched();
    if (this.completedForm?.invalid) {
      return;
    }

    this.formState = 'waitingForPayment';

    this.transactionService
      .createTransfer(
        this.user.wallet.account.address,
        tokenPaymentRecipient,
        environment.tokenHashDVG,
        tokenPaymentAmount
      )
      .then(txn => {
        if (!this.authService.user) {
          throw new Error('Please log in first');
        }
        return this.walletPluginService.signAndAnnounceTx(this.authService.user.wallet.providerName, txn);
      })
      .then(({ txid }) => {
        this.formState = 'waitingForConfirmation';
        const sendData = this.completedForm?.value;
        sendData.ownerAddress = this.user?.wallet?.account?.address;
        this.assetsService.sendForm(this.submitType, sendData).subscribe(
          () => {
            this.sendFormSuccess()
          },
          err => this.sendFormError(err)
        );
      })
      .catch(err => {
        this.formState = 'idle';
        this.snackBarService.show(`Payment failed: ${err.message}`);
      });
  }

  // TODO: HACK setInterval must be refactored when BackEnd ready
  private sendFormSuccess(): void {
    if (this.counterInterval) {
      clearInterval(this.counterInterval);
    }
    this.counterInterval = setInterval(() => {
      this.loadCounter++;
      if (this.loadCounter >= 15 && this.counterInterval) {
        this.formState = 'idle';
        clearInterval(this.counterInterval);
        this.loadCounter = 0;
        this.completedForm?.reset();
        this.getAssets();
        this.snackBarService.show('Successfully Created');
      }
    }, 1000);
  }

  private sendFormError(err: Error): void {
    console.error('Error: ', err);
    this.formState = 'idle';
    this.snackBarService.show(`Deploy failed: ${err.message}`);
  }

  private getAssets(): void {
    this.assetsService
      .getAllAssets()
      .pipe(map(data => data.reverse()))
      .subscribe(assets => {
        this.assetsDataSource = new MatTableDataSource<AssetData>(assets);
        this.dataLength = assets?.length || 0;
      });
  }

  private listenType(): void {
    this.formType$ = this.assetsForm?.get('type')?.valueChanges.pipe(
      takeUntil(this.destroy$),
      startWith('token'),
      distinctUntilChanged(),
      tap((res: 'token' | 'nft') => {
        this.submitType = res;
        this.completedForm = this.assetsForm?.get(res) as FormGroup;
        this.submitBtnName = this.assetsService.getSubmitBtnName(res);
      })
    );
  }
}
