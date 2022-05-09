import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-social-welcome',
  templateUrl: './social-welcome.component.html',
  styleUrls: ['./social-welcome.component.scss'],
})
export class SocialWelcomeComponent implements OnInit, OnDestroy {
  private static readonly timeRemaining = 10_000;

  private intervalHandle?: NodeJS.Timeout;
  private timeoutHandle?: NodeJS.Timeout;

  public socialNetwork = 'twitter';
  public timer = Math.trunc(SocialWelcomeComponent.timeRemaining / 1000);

  constructor(private readonly route: ActivatedRoute, private readonly cRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      this.socialNetwork = params.get('network') ?? 'DVITA';
      this.intervalHandle = setInterval(() => {
        if (this.timer > 0) {
          this.timer -= 1;
          this.cRef.detectChanges();
        }
      }, 1_000);
      this.timeoutHandle = setTimeout(() => window.close(), SocialWelcomeComponent.timeRemaining);
    });
  }

  ngOnDestroy(): void {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }

    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
    }
  }
}
