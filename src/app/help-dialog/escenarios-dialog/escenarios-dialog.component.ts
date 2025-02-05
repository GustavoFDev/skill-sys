import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogActions, MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-escenarios-dialog',
  imports: [MatDialogActions, MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './escenarios-dialog.component.html',
  styleUrl: './escenarios-dialog.component.css'
})
export class EscenariosDialogComponent {

}
