import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdernumberComponent } from './ordernumber.component';

describe('OrdernumberComponent', () => {
  let component: OrdernumberComponent;
  let fixture: ComponentFixture<OrdernumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdernumberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdernumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
