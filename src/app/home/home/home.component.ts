import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { RecentTestComponent } from "../../recent_test/recent-test/recent-test.component";

@Component({
  selector: 'app-home',
  imports: [RecentTestComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export default class HomeComponent {


  constructor(private authService: AuthService, private router: Router) { } logout(): void { this.authService.logout(); }

  

}