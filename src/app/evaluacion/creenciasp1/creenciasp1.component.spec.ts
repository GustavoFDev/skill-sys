import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Creenciasp1Component } from './creenciasp1.component';

describe('Creenciasp1Component', () => {
  let component: Creenciasp1Component;
  let fixture: ComponentFixture<Creenciasp1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Creenciasp1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Creenciasp1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
