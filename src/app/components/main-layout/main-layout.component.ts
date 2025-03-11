import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CommonModule],
  template: `
    <section class="background-radial-gradient overflow-hidden d-flex flex-column min-vh-100">
      <div class="container my-4">
        <app-navbar></app-navbar>
        <router-outlet></router-outlet>
      </div>
    </section>
    <footer>
      <app-footer></app-footer>
    </footer>
  `,
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {}
