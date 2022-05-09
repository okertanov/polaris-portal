import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message-title',
  templateUrl: './message-title.component.html',
  styleUrls: ['./message-title.component.scss'],
})
export class MessageTitleComponent {
  @Input() end = '.';
}
