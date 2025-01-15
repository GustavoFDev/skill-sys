import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { ApplicantService } from '../../core/services/applicant.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CardsPersonasComponent } from '../../components/cards-personas/cards-personas.component';
import { CommonModule } from '@angular/common'
import { NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-test-view', standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule, NgFor, CardsPersonasComponent, MatIconModule],
  templateUrl: './test-view.component.html',
  styleUrls: ['./test-view.component.css']
})

export class TestViewComponent implements OnInit {

  people: any[] = [];


  constructor(private applicantService: ApplicantService) { }

  ngOnInit(): void {
    this.applicantService.getData().subscribe(data => {
      this.people = data;
    });
  }

}