import { Component, AfterViewInit, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'skill-app';
  showNavbar = false;
  showFooter = false;

  private hiddenRoutes: string[] = ['login', 'creencias_personales1', 'applicant', 'creencias_personales2', 'creencias_personales3', 'creencias_personales4' ];

  constructor(private router: Router) {
    // Asegurar que checkRoute se ejecute antes de que el componente se muestre
    this.checkRoute(this.router.url);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkRoute(event.url);
      }
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    import('bootstrap').then(({ Dropdown }) => {
      const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
      const dropdownList = dropdownElementList.map(dropdownToggleEl => new Dropdown(dropdownToggleEl));
    });
  }

  private checkRoute(url: string) {
    const shouldShow = !this.hiddenRoutes.some(route => url.includes(route));
    this.showNavbar = shouldShow;
    this.showFooter = shouldShow;
  }
}
