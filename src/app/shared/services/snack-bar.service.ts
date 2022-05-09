import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  public static snackBarProps = {
    panelClass: 'dvita',
    duration: 5000,
    verticalPosition: 'top' as const,
  };
  constructor(private readonly snackBar: MatSnackBar) {}

  public show(msg: string): void {
    this.snackBar.open(msg, 'OK', SnackBarService.snackBarProps);
  }
}
