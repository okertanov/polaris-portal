import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Transaction } from '@app/pages/explorer/explorer.interfaces';
import { ExplorerService } from '@app/pages/explorer/explorer.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-transaction-information',
  templateUrl: './transaction-information.component.html',
  styleUrls: ['./transaction-information.component.scss'],
})
export class TransactionInformationComponent implements OnInit {
  netValues = ['MaiNet', 'TestNet'];
  netValue = this.netValues[0];
  hash = '';
  transaction$: Observable<Transaction> = new Observable<Transaction>();

  searchValue = '';

  constructor(private readonly route: ActivatedRoute, private readonly explorerService: ExplorerService) {}

  ngOnInit(): void {
    this.hash = this.route.snapshot.params?.hash;
    this.transaction$ = this.explorerService.get(`explorer/transaction/${this.hash}`);
  }

  makeSearch(): void {
    this.explorerService.search(this.searchValue);
  }
  copyClipboard(text: string): void {
    navigator.clipboard.writeText(text);
  }
}
