import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentmanagersComponent } from './departmentmanagers.component';

describe('DepartmentmanagersComponent', () => {
  let component: DepartmentmanagersComponent;
  let fixture: ComponentFixture<DepartmentmanagersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentmanagersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentmanagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
