import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentemployeeComponent } from './departmentemployee.component';

describe('DepartmentemployeeComponent', () => {
  let component: DepartmentemployeeComponent;
  let fixture: ComponentFixture<DepartmentemployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentemployeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentemployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
