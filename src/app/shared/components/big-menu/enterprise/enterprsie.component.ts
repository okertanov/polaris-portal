import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BigMenuStatusService } from '@app/shared/services/big-menu-status.service';

@Component({
  selector: 'app-enterprise',
  templateUrl: './enterprise.component.html',
  styleUrls: ['./enterprise.component.scss'],
})
export class EnterpriseComponent implements OnInit {
  @Input('subItem') subItem = '';

  constructor(
    private readonly router: Router,
    private readonly menuStatusService: BigMenuStatusService
  ) { }

  ngOnInit(): void {
  }

  goNavigate(path: string): void {
    if (this.router.url === path) {
      this.menuStatusService.setBigMenuStatus('');
    }
    this.subItem = path;
    
    this.router.navigateByUrl(path);
  }
}