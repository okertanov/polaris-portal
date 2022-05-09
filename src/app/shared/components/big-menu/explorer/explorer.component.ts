import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BigMenuStatusService} from '@app/shared/services/big-menu-status.service';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss'],
})
export class ExplorerComponent implements OnInit {
  @Input('subItem') subItem = '';

  constructor(
    private readonly router: Router,
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
}
