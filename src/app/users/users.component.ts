import { Component } from '@angular/core';
import { AdminCardsComponent } from '../components/admin-cards/admin-cards.component';
import { AuthService } from '../core/services/auth.service';
import { CommonModule, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-users',
  imports: [AdminCardsComponent, CommonModule, NgFor, MatIconModule, MatButtonModule, MatDividerModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {

    users: any[] = [];
  
  
    constructor(private authService: AuthService, private router: Router){}
  
    ngOnInit(): void {
      this.authService.getData().subscribe(data => {
        this.users = data;
      });
    }

}
