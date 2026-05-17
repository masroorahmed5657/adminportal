import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Top10ReportsComponent } from './top10-reports.component';

describe('Top10ReportsComponent', () => {
  let component: Top10ReportsComponent;
  let fixture: ComponentFixture<Top10ReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Top10ReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Top10ReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
