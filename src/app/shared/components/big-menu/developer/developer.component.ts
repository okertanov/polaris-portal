import { Component, Input, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-developer',
  templateUrl: './developer.component.html',
  styleUrls: ['./developer.component.scss'],
})
export class DeveloperComponent implements OnInit {
  @Input('subItem') subItem = '';

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {}

  openUrl(url: string): void {
    const aTag: HTMLInputElement = this.renderer.createElement('a');
    this.renderer.setAttribute(aTag, 'href', url);
    this.renderer.setAttribute(aTag, 'target', '_blank');
    aTag.click();
  }
}
