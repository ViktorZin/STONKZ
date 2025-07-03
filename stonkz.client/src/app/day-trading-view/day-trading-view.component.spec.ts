import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayTradingViewComponent } from './day-trading-view.component';

describe('DayTradingViewComponent', () => {
  let component: DayTradingViewComponent;
  let fixture: ComponentFixture<DayTradingViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayTradingViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayTradingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
