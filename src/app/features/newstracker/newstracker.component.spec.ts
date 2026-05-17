import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewstrackerComponent } from './newstracker.component';

describe('NewstrackerComponent', () => {
  let component: NewstrackerComponent;
  let fixture: ComponentFixture<NewstrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewstrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewstrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
