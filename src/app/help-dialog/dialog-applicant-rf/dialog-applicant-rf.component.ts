import {ChangeDetectionStrategy, Component, Inject, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';

/**
 * @title Dialog elements
 */
@Component({
  selector: 'app-dialog-applicant-rf',
  templateUrl: './dialog-applicant-rf.component.html',
  styleUrls: ['./dialog-applicant-rf.component.css'],
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogApplicantRFComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
  
}

