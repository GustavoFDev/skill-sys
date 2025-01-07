import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentTestComponent } from './recent-test.component';

describe('RecentTestComponent', () => {
  let component: RecentTestComponent;
  let fixture: ComponentFixture<RecentTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

