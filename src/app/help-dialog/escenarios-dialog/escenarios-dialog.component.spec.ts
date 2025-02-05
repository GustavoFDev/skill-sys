import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscenariosDialogComponent } from './escenarios-dialog.component';

describe('EscenariosDialogComponent', () => {
  let component: EscenariosDialogComponent;
  let fixture: ComponentFixture<EscenariosDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EscenariosDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EscenariosDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
