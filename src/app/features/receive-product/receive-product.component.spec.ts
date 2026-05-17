import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveProductComponent } from './receive-product.component';

describe('ReceiveProductComponent', () => {
  let component: ReceiveProductComponent;
  let fixture: ComponentFixture<ReceiveProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiveProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiveProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
