import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'; 
import { MatPaginator, MatPaginatorModule} from '@angular/material/paginator'; 
import { MatSort, Sort, MatSortModule } from '@angular/material/sort'; 
import { ApplicantService } from '../../core/services/applicant.service';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import bootstrap from 'bootstrap';

@Component({
  selector: 'app-recent-test',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule],
  templateUrl: './recent-test.component.html',
  styleUrl: './recent-test.component.css'
})

export class RecentTestComponent implements OnInit {
  displayedColumns: string[] = ['name_a', 'surname_p', 'surname_m', 'employee', 'former_employee', 'created_at'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator; 
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private applicantService: ApplicantService, private liveAnnouncer: LiveAnnouncer) {}

  ngOnInit(): void {
    this.applicantService.getData().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
}
