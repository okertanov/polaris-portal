import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageComponent } from '@app/shared/modals/message/message.component';

@Component({
  selector: 'app-footer',
  templateUrl: './new-footer.component.html',
  styleUrls: ['./new-footer.component.scss'],
})
export class FooterComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  popUpMessage(): void {
    this.dialog.open(MessageComponent, {
      width: '360',
      height: '180',
    });
  }

  ngOnInit(): void {}
}
