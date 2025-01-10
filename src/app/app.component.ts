import { Component, AfterViewInit, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule, FooterComponent], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'skill-app';
  showNavbar = true;

  constructor(private router: Router) {}

  ngOnInit() {
    // Verificar la ruta activa al iniciar la aplicación
    this.checkRoute(this.router.url);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkRoute(event.url);
      }
    });
  }

  ngAfterViewInit(): void {
    import('bootstrap').then(({ Dropdown }) => {
      const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
      const dropdownList = dropdownElementList.map((dropdownToggleEl) => new Dropdown(dropdownToggleEl));
    });
  }

  private checkRoute(url: string) {
    this.showNavbar = !url.includes('login');
  }
}
