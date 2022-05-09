import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss'],
})
export class VotingComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<VotingComponent>) {}

  ngOnInit(): void {}

  close() {
    this.dialogRef.close();
  }

  connectWallet() {
    this.dialogRef.close({
      connectedWallet: true,
    });
  }
}
