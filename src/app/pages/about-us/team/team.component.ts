import { Component, OnInit } from '@angular/core';

export interface MemberData {
  photo: string;
  name: string;
  position: string;
}

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit {
  teamMembers: MemberData[] = [];

  constructor() {}

  ngOnInit(): void {
    this.teamMembers = [
      {
        photo: 'assets/imgs/team/eduardo-saturino.jpg',
        name: 'Eduardo Saturnino',
        position: 'General Counsel',
      },
      {
        photo: 'assets/imgs/team/ingus-staltmanis.jpg',
        name: 'Ingus Staltmanis',
        position: 'CEO of dVITA Labs',
      },
      {
        photo: 'assets/imgs/team/eduards-marhelis.jpg',
        name: 'Eduards Marhelis',
        position: 'CTO of dVITA Labs',
      },
      {
        photo: 'assets/imgs/team/hassan-aldahan.jpg',
        name: 'Hassan Aldahan',
        position: 'Head of advisory comity',
      }
    ];
  }
}
