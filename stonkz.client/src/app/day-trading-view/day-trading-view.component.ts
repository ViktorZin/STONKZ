import { HttpClient } from '@angular/common/http';
import { Component, OnInit, WritableSignal, signal, effect, inject } from '@angular/core';
import { StonkzData } from '../Interfaces/stonkz-data'
import { Stonk } from '../Interfaces/stonk';
import { StonkzService } from '../stonkz.service';
import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-day-trading-view',
  standalone: true,
  imports: [],
  template: `
    <p>
      day-trading-view works!
    </p>

     <table>
    <thead>
      <tr>
        <th>Stonk</th>
        <th>Price</th>
        <th>Open</th>
        <th>High</th>
        <th>Low</th>
        <th>Volume</th>
        <th>ChangePercentage</th>
      </tr>
    </thead>
    <tbody>
    @for(stonkd of stonkData; track stonkd.stonkId) {
      <tr>
        <td>{{getStonkNameById(stonkd.stonkId)}}</td>
        <td>{{stonkd.price}} €</td>
        <td>{{stonkd.open}} €</td>
        <td>{{stonkd.high}} €</td>
        <td>{{stonkd.low}} €</td>
        <td>{{stonkd.volume}} </td>
        <td>{{stonkd.changePercentage}} %</td>
      </tr>
    }
    </tbody>
  </table>
  `,
  styles: ``
})
export class DayTradingViewComponent implements OnInit {
  stonkData: StonkzData[] = [];
  //filteredStonkData: StonkzData[] = [];
  stonkz: Stonk[] = [];

  stonkzService = inject(StonkzService);
  userData = inject(UserDataService);

  async ngOnInit() {
    this.stonkz = await this.stonkzService.getStonkz();
    this.stonkzService.stonkDataDictReady.subscribe(() => {
      this.fetchGameDayStonkData();
    });
  }

  fetchGameDayStonkData() {
    console.log("fetching GameDayStonkData");
    this.stonkData = [];
    let data: StonkzData | null;
    let date: Date = new Date(this.userData.gameDay);
    for (let i = 0; i < this.stonkz.length; i++) {
      data = this.stonkzService.getStonkDataWithDate(this.stonkz[i].stonkId, date);
      if (data !== null) {
        this.stonkData.push(data);
      }
    }
    console.log("DONE with GameDayStonkData. array length: " + this.stonkData.length);
  }

  getStonkNameById(id: number): string {
    let name = this.stonkz.find(s => s.stonkId === id)?.stonkName;
    return name ?? "";
  }



}
