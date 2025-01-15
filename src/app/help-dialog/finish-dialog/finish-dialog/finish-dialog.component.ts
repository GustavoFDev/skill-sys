import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-finish-dialog',
  templateUrl: './finish-dialog.component.html',
  styleUrls: ['./finish-dialog.component.css']
})
export class FinishDialogComponent {

  constructor(public dialogRef: MatDialogRef<FinishDialogComponent>) {}

  finishSection(): void {
    this.dialogRef.close('finish');
  }

  stayHere(): void {
    this.dialogRef.close('stay');
  }
}
