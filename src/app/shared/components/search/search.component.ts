import { Component } from '@angular/core';
import { ExplorerService } from '@app/pages/explorer/explorer.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  searchValue = '';

  constructor(private readonly explorerService: ExplorerService) {}

  makeSearch(): void {
    this.explorerService.search(this.searchValue);
  }
}
