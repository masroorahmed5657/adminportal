import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAddWithoutImageComponent } from './product-add-without-image.component';

describe('ProductAddWithoutImageComponent', () => {
  let component: ProductAddWithoutImageComponent;
  let fixture: ComponentFixture<ProductAddWithoutImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductAddWithoutImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductAddWithoutImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
