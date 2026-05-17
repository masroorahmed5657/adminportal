import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatreportsComponent } from './catreports.component';

describe('CatreportsComponent', () => {
  let component: CatreportsComponent;
  let fixture: ComponentFixture<CatreportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatreportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
