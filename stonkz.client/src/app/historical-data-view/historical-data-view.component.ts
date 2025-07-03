import { Component, OnInit, WritableSignal, signal, effect, inject } from '@angular/core';
import { StonkzData } from '../Interfaces/stonkz-data'
import { Stonk } from '../Interfaces/stonk';
import { StonkzService } from '../stonkz.service';
import { CommonModule, DatePipe } from '@angular/common';
import { UserDataService } from '../user-data.service';
import { DateComparerService } from '../date-comparer.service';


@Component({
  selector: 'app-historical-data-view',
  imports: [CommonModule],
  standalone: true,
  template: `
    <p>
      historical-data-view works!
    </p>

    <label for="Stonkz">Choose a Stonk: </label>
    @if(stonkz.length > 0) {
      <select name="Stonkz" id="Stonkz" (change)="updateSelectedStonk($event)">
      @for(stonk of stonkz; track stonk.stonkId) {
        <option value="{{stonk.stonkId}}">{{stonk.stonkName}}</option>
      }
      </select>
    }

    <hr>

  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Price</th>
        <th>Open</th>
        <th>High</th>
        <th>Low</th>
        <th>Volume</th>
        <th>ChangePercentage</th>
      </tr>
    </thead>  
    <tbody>
    @for(stonkd of filteredStonkData; track stonkd.date) {
      <tr>
        <td>{{stonkd.date | date:'shortDate'}}</td>
        <td>{{stonkd.price}} €</td>
        <td>{{stonkd.open}} €</td>
        <td>{{stonkd.high}} €</td>
        <td>{{stonkd.low}} €</td>
        <td>{{stonkd.volume}} </td>
        <td>{{stonkd.changePercentage}} %</td>
        <td>{{stonkd.stonkId}}</td>
      </tr>
    }
    </tbody>
  </table>
  `,
  styles: ``
})
export class HistoricalDataViewComponent implements OnInit {


  selectedStonk: WritableSignal<number> = signal(1);
  stonkData: StonkzData[] = [];
  filteredStonkData: StonkzData[] = [];
  stonkz: Stonk[] = [];

  stonkzService = inject(StonkzService);
  userData = inject(UserDataService);
  dateComparer = inject(DateComparerService);

  
  async ngOnInit() {
    console.log("I am in historical Data OnInit, trying to load stonkz");
    this.stonkz = await this.stonkzService.getStonkz();
    console.log("Stonkz should be loaded now...");
    this.selectedStonk.set(1);
    this.debugDateCheck();
  }
  
  debugDateCheck() {
    console.log("2020-01-01 is smaller than 2025-01-01? = " + this.dateComparer.isDateLower(new Date("2020-01-01"), new Date("2025-01-01")));
    console.log("2024-12-31 is smaller than 2020-01-01? = " + this.dateComparer.isDateLower(new Date("2024-12-31"), new Date("2020-01-01")));
  }
  
  
  updateSelectedStonk(event: Event) {
    console.log("Updating selected Stonk");
    let input: number = Number((event.target as HTMLInputElement).value);
    this.selectedStonk.set(input);
  }

  stonkUpdate = effect(() => {
    this.stonkData = [];
    this.filteredStonkData = [];
    this.stonkData = this.stonkzService.getStonkData(this.selectedStonk());
    this.filteredStonkData = this.stonkData.filter(d => this.dateComparer.isDateLower(new Date(d.date), this.userData.gameDay));
    console.log("I should have stonkData now. stonkdata length: " + this.stonkData.length);
  })
}
