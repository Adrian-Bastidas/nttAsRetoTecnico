import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  selected = 1;

  constructor(private router: Router) {}

  navigate(option: number, route: string) {
    this.selected = option;
    this.router.navigate([route]);
  }
}
