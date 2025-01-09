import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCardsComponent } from './admin-cards.component';

describe('AdminCardsComponent', () => {
  let component: AdminCardsComponent;
  let fixture: ComponentFixture<AdminCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
