import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QurbaniComponent } from './qurbani.component';

describe('QurbaniComponent', () => {
  let component: QurbaniComponent;
  let fixture: ComponentFixture<QurbaniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QurbaniComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QurbaniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
