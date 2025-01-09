import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap'; // Usa '* as' para importar todo el módulo de bootstrap
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDivider } from '@angular/material/divider';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, MatDivider],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements AfterViewInit {

  showFiller = false;

  constructor(private authService: AuthService, private router: Router) { }

  logout(): void {
    this.authService.logout();
  }

  @ViewChild('offcanvasWithBothOptions', { static: true }) offcanvas!: ElementRef;


  ngAfterViewInit(): void {
    if (this.offcanvas) {
      const offcanvasElement = this.offcanvas.nativeElement;
      const bsOffcanvas = new bootstrap.Offcanvas(offcanvasElement); offcanvasElement.addEventListener('hidden.bs.offcanvas', () => {
        document.body.classList.remove('modal-open');
      }); offcanvasElement.addEventListener('shown.bs.offcanvas', () => {
        document.body.classList.add('modal-open');
      });
    } else { console.error('Offcanvas element is not available'); }
  }


}
