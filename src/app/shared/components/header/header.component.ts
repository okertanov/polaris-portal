import { animate, group, query, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageComponent } from '@app/shared/modals/message/message.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService, User } from '../../services/auth.service';
import { BigMenuStatusService } from '../../services/big-menu-status.service';

const left = [
  query(':enter, :leave', style({position: 'fixed', width: '100%'}), {optional: true}),
  group([
    query(':enter', [style({transform: 'translateX(-100%)'}), animate('.3s ease-out', style({transform: 'translateX(0%)'}))], {
      optional: true,
    }),
    query(':leave', [style({transform: 'translateX(0%)'}), animate('.3s ease-out', style({transform: 'translateX(100%)'}))], {
      optional: true,
    }),
  ]),
];

const right = [
  query(':enter, :leave', style({position: 'fixed', width: '100%'}), {optional: true}),
  group([
    query(':enter', [style({transform: 'translateX(100%)'}), animate('.3s ease-out', style({transform: 'translateX(0%)'}))], {
      optional: true,
    }),
    query(':leave', [style({transform: 'translateX(0%)'}), animate('.3s ease-out', style({transform: 'translateX(-100%)'}))], {
      optional: true,
    }),
  ]),
];


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        transform: 'none',
      })),
      state('closed', style({
        transform: 'translateX(-100%)'
      })),
      transition('open => closed', [
        animate('0.5s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ]),
    trigger('animSlider', [
      transition(':increment', right),
      transition(':decrement', left),
    ]),
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private toggleButton: any;
  private sidebarVisible = false;
  private destroy$: Subject<void> = new Subject<void>();
  isOpen = false;
  showCustomToggle = true;
  user: User | null = null;
  language = 'Eng';

  path = '';

  isLoggedIn = false;

  counter = 0;
  list: Array<string> = ['all', 'dvita', 'platform', 'explorer', 'developer', 'partners', 'aboutUs', 'lang'];

  topBarBackground: 'bg-white' | 'bg-transparent' | '' = 'bg-white';

  @Input() set isLanding(isLanding: boolean) {
    // this.topBarBackground = isLanding ? 'bg-transparent' : 'bg-white'
    // this.topBarBackground = isLanding ? 'bg-white' : 'bg-white'
  };

  @HostListener('document:click', ['$event.target'])
  clickout(target: HTMLElement): void {
    if (this.eRef.nativeElement.contains(target)) {
    } else {
      this.statusService.setBigMenuStatus('');
    }
  }

  @HostListener('window:scroll')
  onContentScrolled() {
    // this.setBackground(this.router.url);
  }

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
    private statusService: BigMenuStatusService,
    private eRef: ElementRef
  ) {
  }

  ngOnInit(): void {
    this.auth.userObservable.pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.user = user;
    });
  }


  private setBackground(url: string) {
    if (url === '/') {
      // this.topBarBackground = window.pageYOffset > 70 ? 'bg-white' : 'bg-transparent';
      this.topBarBackground = window.pageYOffset > 0 ? 'bg-white' : 'bg-white';
    } else {
      this.topBarBackground = 'bg-white';
    }
  }

  sidebarClose(): void {
    const html = document.getElementsByTagName('html')[0];
    this.toggleButton?.classList.remove('toggled');
    this.sidebarVisible = false;
    html.classList?.remove('nav-open');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  goHome(): void {
    this.router.navigateByUrl('/');
  }

  logout(): void {
    this.auth.logOut();
  }

  mobileNavigate(path: string): void {
    if (this.router.url !== path) {
      this.isOpen = false;
      this.initCounter();
      this.router.navigateByUrl(path);
    }
  }

  setLanguage(lang: string): void {
    this.language = lang;
    this.initCounter();
    this.isOpen = false;
  }

  onNext(index: number): void {
    this.counter = index;
  }

  initCounter(): void {
    this.counter = 0;
  }

  goLoginConnect(routerLink: string): void {
    this.router.navigateByUrl(routerLink);
  }

  bigMenu(field: string): void {
    const isSameField = this.statusService.bigMenuStatus.value === field;
    this.statusService.setBigMenuStatus(isSameField ? '' : field);
  }
  features(): void {
    this.router.navigateByUrl('');
    window.scrollTo(600, 700);
  }
  navigateFoundation() {
    window.open('https://dvita.foundation/');
  }

  popUpMessage(): void {
    this.dialog.open(MessageComponent, {
      width: '360',
      height: '180',
    });
  }
}
