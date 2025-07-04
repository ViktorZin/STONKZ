import { HttpClient } from '@angular/common/http';
import { Component, OnInit, WritableSignal, signal, effect, inject } from '@angular/core';
import { StonkzData } from '../Interfaces/stonkz-data'
import { Stonk } from '../Interfaces/stonk';
import { StonkzService } from '../stonkz.service';
import { UserDataService } from '../user-data.service';
import { DateComparerService } from '../date-comparer.service';

@Component({
  selector: 'app-day-trading-view',
  standalone: true,
  imports: [],
  template: `
    <p>
      day-trading-view works!
    </p>
    @if(checkDay()) {
       <table>
    <thead>
      <tr>
        <th>Actions</th>
        <th>Stonk</th>
        <th>Price</th>
        <th>Open</th>
        <th>High</th>
        <th>Low</th>
        <th>ChangePercentage</th>
        <th>Volume</th>
      </tr>
    </thead>
    <tbody>
    @for(stonkd of stonkData; track stonkd.stonkId) {
      <tr>
        <td><button [disabled]="testAffordability(stonkd.price)" (click)="buyStonkz(stonkd.stonkId)">BUY</button>  / <button [disabled]="testStonkOwnage(stonkd.stonkId)" (click)="sellStonkz(stonkd.stonkId, stonkd.price)">SELL</button></td>
        <td>{{getStonkNameById(stonkd.stonkId)}}</td>
        <td>{{stonkd.price}} €</td>
        <td>{{stonkd.open}} €</td>
        <td>{{stonkd.high}} €</td>
        <td>{{stonkd.low}} €</td>
        <td>{{stonkd.changePercentage}} %</td>
        <td>{{stonkd.volume}} </td>
      </tr>
    }
    </tbody>
  </table>
    }
    @else {
      <h1>THE STOCK MARKET IS CLOSED ON WEEKENDS!</h1>
    }
    
  `,
  styles: ``
})
export class DayTradingViewComponent implements OnInit {

  stonkData: StonkzData[] = [];
  stonkz: Stonk[] = [];
  stonkzService = inject(StonkzService);
  userData = inject(UserDataService);
  dateComparer = inject(DateComparerService);

  async ngOnInit() {
    this.stonkz = await this.stonkzService.getStonkz();
    this.stonkzService.stonkDataDictReady.subscribe(() => {
      this.fetchGameDayStonkData(new Date(this.userData.gameDay()));
    });
  }

  checkDay(): boolean {
    return this.dateComparer.isWeekDay(new Date(this.userData.gameDay()));
  }

  dayUpdate = effect(() => {
    //console.log("triggering DayUpdate, after something updated the current GameDay.");
    this.fetchGameDayStonkData(new Date(this.userData.gameDay()));
  });

  fetchGameDayStonkData(gameDay: Date) {
    //console.log("fetching GameDayStonkData");
    this.stonkData = [];
    let data: StonkzData | null;
    for (let i = 0; i < this.stonkz.length; i++) {
      data = this.stonkzService.getStonkDataWithDate(this.stonkz[i].stonkId, gameDay);
      if (data !== null) {
        this.stonkData.push(data);
      }
    }
   // console.log("DONE with GameDayStonkData. array length: " + this.stonkData.length);
  }

  getStonkNameById(id: number): string {
    let name = this.stonkz.find(s => s.stonkId === id)?.stonkName;
    return name ?? "";
  }

  //Reversed logic, because I am asking if a button is disabled. so true means disabled.
  testAffordability(price: number): boolean {
    //console.log("Testing Affordability for price: " + price + " against account Balance of " + this.userData.accountBalance);
    if (this.userData.accountBalance >= price) {
      return false;
    }
    return true;
  }

  //Reversed logic, because I am asking if a button is disabled. so true means disabled.
  testStonkOwnage(id: number): boolean {
    if (id in this.userData.stonkzWallet) {
      if (this.userData.stonkzWallet[id].length > 0) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  buyStonkz(id: number) {
    console.log("I wanted to buy " + this.getStonkNameById(id) + " stonkz");
    for (let i = 0; i < this.stonkData.length; i++) {
      if (id === this.stonkData[i].stonkId) {
        if (this.userData.accountBalance >= this.stonkData[i].price) {
          this.userData.buyStonkz(this.stonkData[i]);
        } else {
          console.log("Insufficient Funds!");
        }
      }
    }
  }

  sellStonkz(id: number, currentPrice: number) {
    console.log("I wanted to sell " + this.getStonkNameById(id) + " stonkz");

    this.userData.sellStonkz(id, currentPrice);

  }
}
