
import { Routes } from '@angular/router';
import { HistoricalDataViewComponent } from './historical-data-view/historical-data-view.component';
import { DayTradingViewComponent } from './day-trading-view/day-trading-view.component';

export const routes: Routes = [
  {
    path: '',
    component: DayTradingViewComponent
  },
  {
    path: 'historicalData/:id',
    component: HistoricalDataViewComponent
  }
  
];
