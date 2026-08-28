import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EzpzTaxComponent } from './ezpz-tax.component';

describe('EzpzTaxComponent', () => {
  let component: EzpzTaxComponent;
  let fixture: ComponentFixture<EzpzTaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EzpzTaxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EzpzTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
