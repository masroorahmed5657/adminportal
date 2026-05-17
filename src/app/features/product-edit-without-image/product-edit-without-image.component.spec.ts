import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductEditWithoutImageComponent } from './product-edit-without-image.component';

describe('ProductEditWithoutImageComponent', () => {
  let component: ProductEditWithoutImageComponent;
  let fixture: ComponentFixture<ProductEditWithoutImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductEditWithoutImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductEditWithoutImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
