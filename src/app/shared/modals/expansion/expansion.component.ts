import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-expansion-panel',
  templateUrl: './expansion.component.html',
  styleUrls: ['./expansion.component.scss'],
  animations: [
    trigger('openClose', [
      transition('void => *', [style({ height: '0px' }), animate(400)]),
      transition('* => void', [animate(0, style({ height: '0px' }))]),
    ]),
  ],
})
export class ExpansionComponent {
  isOpen = false;

  toggle(): void {
    this.isOpen = !this.isOpen;
  }
}
