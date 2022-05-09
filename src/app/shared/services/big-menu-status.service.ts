import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BigMenuStatusService {
  bigMenuStatus: BehaviorSubject<string> = new BehaviorSubject('');
  constructor() {}

  setBigMenuStatus(field: string): void {
    this.bigMenuStatus.next(field);
  }
}
