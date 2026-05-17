import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSimpleEditComponent } from './product-simple-edit.component';

describe('ProductSimpleEditComponent', () => {
  let component: ProductSimpleEditComponent;
  let fixture: ComponentFixture<ProductSimpleEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSimpleEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSimpleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
