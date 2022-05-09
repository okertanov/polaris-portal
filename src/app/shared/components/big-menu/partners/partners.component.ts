import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageComponent } from '@app/shared/modals/message/message.component';
import { BigMenuStatusService } from '@app/shared/services/big-menu-status.service';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss'],
})
export class PartnersComponent implements OnInit {
  @Input('subItem') subItem = '';

  constructor(
    private readonly router: Router,
    private readonly menuStatusService: BigMenuStatusService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  goNavigate(path: string): void {
    if (this.router.url === path) {
      this.menuStatusService.setBigMenuStatus('');
    }
    this.subItem = path;
    setTimeout(() => {
      this.router.navigateByUrl(path);
    }, 30);
  }

  popUpMessage() : void {
    this.dialog.open(MessageComponent, { });
  }
}
