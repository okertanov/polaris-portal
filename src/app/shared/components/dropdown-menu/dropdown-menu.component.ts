import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.scss'],
})
export class DropdownMenuComponent {
  open = false;
  @Input() value = '';
  @Input() values: { name: string, disabled?: boolean }[] = [];
  @Output() change = new EventEmitter<string>();

  onSelect(value: string): void {
    this.value = value;
    this.change.emit(value);
  }
}
