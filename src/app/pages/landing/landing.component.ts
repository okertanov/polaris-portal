import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit, AfterViewInit {
  // @ViewChild('animationDiv') animationElement: ElementRef;

  detectedElms = [];

  constructor(private renderer: Renderer2) {
    // this.renderer.listen('window', 'resize', this.detectElms.bind(this));
    // this.renderer.listen('window', 'scroll', this.detectElms.bind(this));
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // setTimeout(this.detectElms.bind(this));
  }

  // detectElms(): void {
  //   const starsEl = document.querySelector('.stars');
  //   const cloud1El = document.querySelector('.cloud1');
  //   const cloud2El = document.querySelector('.cloud2');
  //   const rocketEl = document.querySelector('.rocket');
  //   const smoke1El1 = document.querySelector('.smoke1');
  //   const smoke2El1 = document.querySelector('.smoke2');
  //   if (isInViewport(this.animationElement.nativeElement)) {
  //     if (!starsEl?.classList.contains("stars-animation")) {
  //       starsEl?.classList.add('stars-animation');
  //     }
  //     if (!cloud1El?.classList.contains("cloud1-animation")) {
  //       cloud1El?.classList.add('cloud1-animation');
  //     }
  //     if (!cloud2El?.classList.contains("cloud2-animation")) {
  //       cloud2El?.classList.add('cloud2-animation');
  //     }
  //     if (!rocketEl?.classList.contains("rocket-animation")) {
  //       rocketEl?.classList.add('rocket-animation');
  //     }
  //     if (!smoke1El1?.classList.contains("smoke1-animation")) {
  //       smoke1El1?.classList.add('smoke1-animation');
  //     }
  //     if (!smoke2El1?.classList.contains("smoke2-animation")) {
  //       smoke2El1?.classList.add('smoke2-animation');
  //     }
  //   } else {
  //     const starsEl = document.querySelector('.stars');
  //     if (starsEl?.classList.contains("stars-animation")) {
  //       starsEl?.classList.remove('stars-animation');
  //     }
  //     if (cloud1El?.classList.contains("cloud1-animation")) {
  //       cloud1El?.classList.remove('cloud1-animation');
  //     }
  //     if (cloud2El?.classList.contains("cloud2-animation")) {
  //       cloud2El?.classList.remove('cloud2-animation');
  //     }
  //     if (rocketEl?.classList.contains("rocket-animation")) {
  //       rocketEl?.classList.remove('rocket-animation');
  //     }
  //     if (smoke1El1?.classList.contains("smoke1-animation")) {
  //       smoke1El1?.classList.remove('smoke1-animation');
  //     }
  //     if (smoke2El1?.classList.contains("smoke2-animation")) {
  //       smoke2El1?.classList.remove('smoke2-animation');
  //     }
  //   }
  // }

  learn(): void {
    window.scrollTo(600, 700);
  }

  launch(): void {
    const starsEl = document.querySelector('.stars');
    starsEl?.classList.add('stars-animation');
    // console.error("starEl", starsEl);
  }
}

function isInViewport(elm: any): any {
  const allUsers: { name: string; status: string; balance: number }[] = [];

  [{ name: 'User-1', balance: 1000, status: 'dVita_user' }].forEach(user => {
    if (user.status === 'dVita_user') {
      user.balance = user.balance * 1000;
      console.log('New user Balance: ', `${user.balance}$`);
    }
  });

  const elementTop = elm.offsetTop;
  const elementBottom = elementTop + elm.offsetHeight;
  // in this specific case the scroller is document.documentElement (<html></html> node)
  const viewportTop = document.documentElement.scrollTop;
  const viewportBottom = viewportTop + document.documentElement.clientHeight;
  return elementBottom > viewportTop && elementTop < viewportBottom;
}
