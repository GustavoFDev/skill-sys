import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-admin-cards',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, MatSlideToggleModule, MatIconModule, MatDivider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-cards.component.html',
  styleUrl: './admin-cards.component.css'
})
export class AdminCardsComponent {
  @Input() nombre: string = '';
  @Input() apellidos: string = '';
  @Input() email: string = '';
  @Input() created_at: string = '';
  @Input() isActive: boolean = false;

  @Output() toggleStatus = new EventEmitter<boolean>();
  @Output() deleteUser = new EventEmitter<void>();






  onToggleChange(): void {
    this.isActive = !this.isActive;
    this.toggleStatus.emit(this.isActive);
  }

  onDeleteUser(): void {
    this.deleteUser.emit();
  }

}
