import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSimpleAddComponent } from './product-simple-add.component';

describe('ProductSimpleAddComponent', () => {
  let component: ProductSimpleAddComponent;
  let fixture: ComponentFixture<ProductSimpleAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSimpleAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSimpleAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
