import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';
import { BigMenuStatusService } from '../../services/big-menu-status.service';

@Component({
  selector: 'app-big-menu',
  templateUrl: './big-menu.component.html',
  styleUrls: ['./big-menu.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('500ms ease-in', style({ transform: 'translateY(0%)' })),
      ]),
      transition(':leave', [animate('500ms ease-in', style({ transform: 'translateY(-100%)' }))]),
    ]),
  ],
})
export class BigMenuComponent implements OnInit {
  path: string = '';
  visible: boolean = false;
  field: string = '';
  bigMenuItem: string = '';

  constructor(private router: Router, private statusService: BigMenuStatusService) {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        this.statusService.setBigMenuStatus('');
        this.bigMenuItem = event.url;
      });

    this.statusService.bigMenuStatus.subscribe((field: string) => {
      this.field = field;
      if (field) {
        this.visible = true;
      } else {
        this.visible = false;
      }
    });
  }

  ngOnInit(): void {}

  goNavigate(path: string) {
    this.router.navigateByUrl(path);
  }
}
