import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { BigMenuStatusService } from '@app/shared/services/big-menu-status.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent implements OnInit {
  @Input('subItem') subItem = '';

  constructor(
    private readonly router: Router,
    private renderer: Renderer2,
    private readonly menuStatusService: BigMenuStatusService
  ) {
  }

  ngOnInit(): void {
  }

  goNavigate(path: string): void {
    if (this.router.url === path) {
      this.menuStatusService.setBigMenuStatus('');
    }
    this.subItem = path;
    setTimeout(() => {
      this.router.navigateByUrl(path);
    }, 30);
  }

  openUrl(url: string, target: string = 'self'): void {
    const aTag: HTMLInputElement = this.renderer.createElement('a');
    this.renderer.setAttribute(aTag, 'href', url);
    this.renderer.setAttribute(aTag, 'target', `_${target}`);
    aTag.click();
  }
}
