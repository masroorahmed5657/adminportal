import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredProductComponent } from './expired-product.component';

describe('ExpiredProductComponent', () => {
  let component: ExpiredProductComponent;
  let fixture: ComponentFixture<ExpiredProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpiredProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpiredProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
