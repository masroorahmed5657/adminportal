import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMasterEditComponent } from './product-master-edit.component';

describe('ProductMasterEditComponent', () => {
  let component: ProductMasterEditComponent;
  let fixture: ComponentFixture<ProductMasterEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductMasterEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductMasterEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
