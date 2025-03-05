import { Component, AfterViewInit, OnInit, Renderer2 } from '@angular/core';
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

  private hiddenRoutes: string[] = ['login', 'creencias_personales1', 'applicant', 'creencias_personales2', 'creencias_personales3', 'creencias_personales4', 'razonamiento_numerico', 'escenarios_realistas', 'razonamiento_logico', 'conteo_figuras'];

  constructor(private router: Router, private renderer: Renderer2) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkRoute(event.urlAfterRedirects);
      }
    });
  }

  ngOnInit() {
    this.checkRoute(this.router.url);
  }

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

    const navbar = document.querySelector('app-navbar');
    const footer = document.querySelector('footer');

    if (navbar) {
      if (this.showNavbar) {
        this.renderer.removeClass(navbar, 'd-none');
      } else {
        this.renderer.addClass(navbar, 'd-none');
      }
    }

    if (footer) {
      if (this.showFooter) {
        this.renderer.removeClass(footer, 'd-none');
      } else {
        this.renderer.addClass(footer, 'd-none');
      }
    }
  }
}
