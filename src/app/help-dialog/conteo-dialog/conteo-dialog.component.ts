import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-conteo-dialog',
  templateUrl: './conteo-dialog.component.html',
  styleUrls: ['./conteo-dialog.component.css']
})
export class ConteoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConteoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { isCorrect?: boolean; isTimeout?: boolean }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
