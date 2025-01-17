import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'app-finish-dialog',
  templateUrl: './finish-dialog.component.html',
  styleUrls: ['./finish-dialog.component.css'],
  imports: [MatDialogModule, MatButtonModule] // Aquí es válido si es standalone
})
export class FinishDialogComponent {
  constructor(public dialogRef: MatDialogRef<FinishDialogComponent>) {}

  finish(): void {
    this.dialogRef.close('finish');
  }

  stayHere(): void {
    this.dialogRef.close('stay');
  }
}
