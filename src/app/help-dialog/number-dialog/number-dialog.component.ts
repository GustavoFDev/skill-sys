import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-number-dialog',
  imports: [MatButtonModule, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './number-dialog.component.html',
  styleUrl: './number-dialog.component.css'
})
export class NumberDialogComponent {
  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(NumberDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
