import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscenariosRealistComponent } from './escenarios-realist.component';

describe('EscenariosRealistComponent', () => {
  let component: EscenariosRealistComponent;
  let fixture: ComponentFixture<EscenariosRealistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EscenariosRealistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EscenariosRealistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
