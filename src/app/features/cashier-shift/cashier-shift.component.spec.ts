import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierShiftComponent } from './cashier-shift.component';

describe('CashierShiftComponent', () => {
  let component: CashierShiftComponent;
  let fixture: ComponentFixture<CashierShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashierShiftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashierShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
