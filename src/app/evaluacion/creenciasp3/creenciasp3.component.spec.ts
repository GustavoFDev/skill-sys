import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Creenciasp3Component } from './creenciasp3.component';

describe('Creenciasp3Component', () => {
  let component: Creenciasp3Component;
  let fixture: ComponentFixture<Creenciasp3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Creenciasp3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Creenciasp3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
