import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-our-partners',
  templateUrl: './our-partners.component.html',
  styleUrls: ['./our-partners.component.scss'],
})
export class OurPartnersComponent implements OnInit {
  partners: string[] = [];

  constructor() {}

  ngOnInit(): void {
    this.partners = [
      'megaTrading',
      'huawei',
      'payoneer',
      'megaTrading',
      'huawei',
      'megaTrading',
      'huawei',
      'payoneer',
      'megaTrading',
      'huawei',
      'payoneer',
      'megaTrading',
      'huawei',
      'megaTrading',
      'huawei',
      'payoneer',
      'megaTrading',
      'huawei',
      'payoneer',
      'megaTrading',
      'huawei',
      'megaTrading',
      'huawei',
      'payoneer',
      'megaTrading',
      'huawei',
      'payoneer',
      'megaTrading',
      'huawei',
      'megaTrading',
      'huawei',
      'payoneer',
    ];
  }
}
