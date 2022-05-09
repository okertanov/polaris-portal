import { Component, OnInit } from '@angular/core';
import { ExplorerService } from '@app/pages/explorer/explorer.service';

@Component({
  selector: 'app-contracts-info',
  templateUrl: './contracts-info.component.html',
  styleUrls: ['./contracts-info.component.scss']
})
export class ContractsInfoComponent implements OnInit {
  netValues = ['Mainnet', 'TestNet'];
  netValue = this.netValues[0];

  searchValue = '';

  constructor(private readonly explorerService: ExplorerService) { }

  ngOnInit(): void {
  }

  makeSearch(): void {
    this.explorerService.search(this.searchValue);
  }

}
