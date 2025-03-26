import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigationservice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sub-nav',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './sub-nav.component.html',
  styleUrl: './sub-nav.component.css'
})
export class SubNavComponent implements OnInit {
  subNavItems: string[] = [];

  constructor(private navigationService: NavigationService) {}

  ngOnInit() {
    this.navigationService.activeNav$.subscribe(nav => {
      this.subNavItems = this.navigationService.getSubNavItems(nav);
    });
  }
}
