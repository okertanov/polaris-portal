import { Component, OnInit } from '@angular/core';
import { AppData, ApplicationsService } from '@app/pages/applications/applications.service';

@Component({
  selector: 'app-wallets',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
})
export class ApplicationsComponent implements OnInit {
  appsList: AppData[] = [];

  constructor(private readonly applicationsService: ApplicationsService) {}

  ngOnInit(): void {
    /** Mock Data for testing */
    this.appsList = this.applicationsService.appsList;
  }
}
