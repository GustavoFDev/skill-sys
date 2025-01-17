import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApplicantService } from '../../core/services/applicant.service';
import { CardsPersonasComponent } from '../../components/cards-personas/cards-personas.component';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-test-view',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    NgFor,
    CardsPersonasComponent,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './test-view.component.html',
  styleUrls: ['./test-view.component.css']
})

export class TestViewComponent implements OnInit {

  people: any[] = [];
  filteredPeople: any[] = [];
  searchControl = new FormControl('');
  filters: any[] = [
    { name: 'Mas Reciente', active: false, type: 'sort', value: 'reciente' },
    { name: 'Mas Antiguo', active: false, type: 'sort', value: 'antiguo' },
    { name: 'Empleado Si', active: false, type: 'employee', value: 'si' },
    { name: 'Empleado No', active: false, type: 'employee', value: 'no' },
    { name: 'Últimos 7 días', active: false, type: 'date', value: 'last_7_days' },
    { name: 'Últimos 30 días', active: false, type: 'date', value: 'last_30_days' },
    { name: 'A-Z', active: false, type: 'alphabet', value: 'a_z' },
    { name: 'Z-A', active: false, type: 'alphabet', value: 'z_a' },
  ];

  constructor(private applicantService: ApplicantService) { }

  ngOnInit(): void {
    this.applicantService.getData().subscribe(data => {
      this.people = data;
      this.applyFilters();  // Aplicar filtros en la inicialización
    });

    this.searchControl.valueChanges.subscribe(() => this.applyFilters());
  }

  applyFilters(): void {
    let filtered = this.people;

    // Aplicar filtro de búsqueda
    const filterValue = this.searchControl.value;
    if (filterValue && filterValue.trim() !== '') {
      filtered = filtered.filter(person =>
        person.name_a.toLowerCase().includes(filterValue.trim().toLowerCase()) ||
        person.surname_p.toLowerCase().includes(filterValue.trim().toLowerCase()) ||
        person.surname_m.toLowerCase().includes(filterValue.trim().toLowerCase()) ||
        person.email_a.toLowerCase().includes(filterValue.trim().toLowerCase())
      );
    }

    // Aplicar otros filtros
    this.filters.forEach(filter => {
      if (filter.active) {
        if (filter.type === 'employee') {
          filtered = filtered.filter(person => filter.value === 'si' ? person.employee : !person.employee);
        } else if (filter.type === 'sort') {
          if (filter.value === 'reciente') {
            filtered = filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
          } else if (filter.value === 'antiguo') {
            filtered = filtered.sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());
          }
        } else if (filter.type === 'date') {
          const now = new Date();
          if (filter.value === 'last_7_days') {
            filtered = filtered.filter(person => (now.getTime() - new Date(person.updated_at).getTime()) / (1000 * 3600 * 24) <= 7);
          } else if (filter.value === 'last_30_days') {
            filtered = filtered.filter(person => (now.getTime() - new Date(person.updated_at).getTime()) / (1000 * 3600 * 24) <= 30);
          }
        } else if (filter.type === 'alphabet') {
          if (filter.value === 'a_z') {
            filtered = filtered.sort((a, b) => a.name_a.localeCompare(b.name_a));
          } else if (filter.value === 'z_a') {
            filtered = filtered.sort((a, b) => b.name_a.localeCompare(a.name_a));
          }
        }
      }
    });

    this.filteredPeople = filtered;
  }

  toggleFilter(filter: any): void {
    // Desactivar filtros mutualmente exclusivos
    if (filter.type === 'sort' || filter.type === 'employee' || filter.type === 'date' || filter.type === 'alphabet') {
      this.filters.forEach(f => {
        if (f.type === filter.type && f !== filter) {
          f.active = false;
        }
      });
    }
    filter.active = !filter.active;
    this.applyFilters();
  }
}
