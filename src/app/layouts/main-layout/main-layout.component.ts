import { DOCUMENT, Location } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  private _router!: Subscription;
  @ViewChild(HeaderComponent) navbar!: HeaderComponent;
  path: string = '';
  isLanding!: boolean;

  constructor(
    private renderer: Renderer2,
    private router: Router,
    @Inject(DOCUMENT)
    private document: any,
    private element: ElementRef,
    public location: Location
  ) {}

  ngOnInit(): void {
    this.checkLanding();
    // var navbar: HTMLElement = this.element.nativeElement.children[0].children[0];
    this._router = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        this.checkLanding();
        this.path = this.router.url;
        console.log(this.path);
        if (window.outerWidth > 991) {
          window.document.children[0].scrollTop = 0;
        } else if (window.document.activeElement) {
          window.document.activeElement.scrollTop = 0;
        }
        this.navbar?.sidebarClose();
      });
    //
    // this.path = this.router.url;
    //
    // this.renderer.listen('window', 'scroll', event => {
    //   const number = window.scrollY;
    //   var _location = this.location.path();
    //   _location = _location.split('/')[2];
    //
    //   if (number > 78 || window.pageYOffset > 78) {
    //     navbar?.classList.remove('navbar-transparent');
    //   } else if (_location !== 'login' && this.location.path() !== '/nucleoicons') {
    //     // remove logic
    //     navbar?.classList.add('navbar-transparent');
    //   }
    // });
  }

  checkLanding() {
    this.isLanding = this.router.url === '/';
  }
}
