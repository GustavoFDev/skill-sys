import { Component } from '@angular/core';
import { AdminCardsComponent } from '../components/admin-cards/admin-cards.component';
import { AuthService } from '../core/services/auth.service';
import { CommonModule, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RegisterComponent } from '../authentication/register/register.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [AdminCardsComponent, CommonModule, NgFor, MatIconModule, MatButtonModule, MatDividerModule, MatDialogModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {

  users: any[] = [];

  constructor(private authService: AuthService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.authService.getData().subscribe(data => {
      this.users = data;
    });
  }

  openRegisterDialog(): void {
    const dialogRef = this.dialog.open(RegisterComponent);

    dialogRef.componentInstance.userRegistered.subscribe(() => {
      this.loadUsers();
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  toggleUserStatus(userId: number, isActive: boolean): void {
    this.authService.toggleUserStatus(userId, isActive).subscribe(
      response => {
        console.log('User status updated successfully', response);
        this.loadUsers();
      },
      error => {
        console.error('Error updating user status', error);
      }
    );
  }

  deleteUser(userId: number): void {
    this.authService.deleteUser(userId).subscribe(
      response => { 
        console.log('User deleted successfully', response);
        this.loadUsers(); 
      }, error => { 
        console.error('Error deleting user', error);
      }
    );
  }

}
