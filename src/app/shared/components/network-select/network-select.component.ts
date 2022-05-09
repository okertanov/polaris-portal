import { Component } from '@angular/core';
import { APIService } from '@app/shared/services/api.service';

@Component({
  selector: 'app-network-select',
  templateUrl: './network-select.component.html',
  styleUrls: ['./network-select.component.scss'],
})
export class NetworkSelectComponent {
  initialValue = this.apiService.getNetwork();
  readonly networkValues = [
    {name: 'TestNet'},
    {name: 'MainNet', disabled: true}
  ];

  constructor(private readonly apiService: APIService) {
  }


  onSelect(value: string): void {
    this.apiService.setNetwork(value);
  }
}
