import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Creenciasp2Component } from './creenciasp2.component';

describe('Creenciasp2Component', () => {
  let component: Creenciasp2Component;
  let fixture: ComponentFixture<Creenciasp2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Creenciasp2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Creenciasp2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
