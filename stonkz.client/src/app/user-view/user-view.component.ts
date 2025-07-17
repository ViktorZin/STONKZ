import { Component, inject} from '@angular/core';
import { UserDataService } from '../user-data.service';
import { CommonModule, DatePipe } from '@angular/common';
import { StonkzService } from '../stonkz.service';
import { DateComparerService } from '../date-comparer.service';
import { OwnedStonkz } from '../Interfaces/owned-stonkz';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [CommonModule],
  template: `
  @if(userData.userDataDB) {
     <p>
      Welcome, User {{userData.userDataDB.userName}}!
    </p>
    <!--<button (click)="resetUserData()">RESET DB USER DATA</button>-->
    <p>Account Balance: {{userData.userDataDB.accountBalance.toFixed(2)}} €  /  invested: {{getCalculatedInvestedMoney()}} €</p>
    <p>current GameDay: {{userData.gameDay() | date:'EEEE dd.MM.yyyy'}}</p>
    <p>Daily Buy Fee: {{userData.dailyBuyFee}} ||  Daily Sell Fee: {{userData.dailySellFee}}</p>
    <button (click)="progressToNextDay()"> Progress to Next Day </button>

    <div>
    <details>
      <summary>Owned Stonkz</summary>
      <!--<p>STONK ID ARRAY</p>-->
      <div class="tableContainer">
               <table>
            <thead>
              <tr>
                <th>Stonk</th>
                <th>Price</th>
                <th>Buy Date</th>
                <th>curr Price</th>
                <th>Difference</th>
              </tr>
            </thead>
            <tbody>
      @for(entry of stonkzService.getStonkzIDs(); track entry) {
        @let searchEntry = entry +1;
        @if(checkStonkOwnage(searchEntry)) {
          <!--<p>{{stonkzService.getStonkzNameById(userData.stonkzWallet[entry + 1][0].stonkId)}}</p>-->

              @for(boughtStonk of getOwnedStonkArray(searchEntry); track $index) {
                @let data = getStonkPriceDifference(boughtStonk.pricePerStonk, getCurrentPriceOfStonk(boughtStonk.stonkId));  
                <tr>
                  <td class="textRight">{{stonkzService.getStonkzNameById(boughtStonk.stonkId)}}</td>
                  <td class="textRight">{{boughtStonk.pricePerStonk}} €</td>
                  <td>{{boughtStonk.boughtDate | date:'dd.MM.yyyy'}}</td>
                  <td>{{getCurrentPriceOfStonk(boughtStonk.stonkId)}} €</td>
                  <td [class]="stonkzService.checkValue(data)">{{data.toFixed(2)}} €</td>
                </tr>
              }

        }

      }
        </tbody>
          </table>
          </div>
    </details>
    </div>

    <div>
    <br> <br>
    </div>
  }
  @else {
    <h3>Lade UserDaten...</h3>
  }
  `,
  styles: ``
})
export class UserViewComponent  {

  userData = inject(UserDataService);
  stonkzService = inject(StonkzService);
  dateComparer = inject(DateComparerService);

  async progressToNextDay() {
    //this.userData.gameDay.setDate(this.userData.gameDay.getDate() + 1);
    if (this.dateComparer.isLastDayOfMonth(this.userData.gameDay())) {
      this.userData.userDataDB.accountBalance += 100;
    }
    
    await this.userData.removeOwnedStonkzFromDB().then(() => {
      //this.userData.getOwnedStonkzDataFromDB();
      this.userData.dailyBuyFee = true;
      this.userData.dailySellFee = true;

      let nextDay: Date = new Date(this.userData.gameDay());
      nextDay.setDate(nextDay.getDate() + 1);
      this.userData.gameDay.set(nextDay);

      this.userData.saveUserDataToDB();
      this.userData.saveOwnedStonkDataToDB();
    })
  }

  getCurrentPriceOfStonk(id: number): number {
    let price: number = 0;
    var data = this.stonkzService.getStonkDataWithDate(id, new Date(this.userData.gameDay()));
    if(data != null) {
      price = data.price;
    }
    return price;
  }

  getStonkPriceDifference(boughtPrice: number, currPrice: number) {
    return boughtPrice - currPrice;
  }

  getCalculatedInvestedMoney(): number {
    let startDate: Date = new Date('2021-01-03');
    let currDate: Date = new Date(this.userData.gameDay());
    let months: number = ((currDate.getFullYear() - startDate.getFullYear()) * 12) + (currDate.getMonth() - startDate.getMonth());
    return 100 + (100 * months);
  }

  addUserData() {
    //this.userData.setInitialUserData();
  }

  resetUserData() {
    this.userData.resetUserDataToDefault();
  }

  checkStonkOwnage(id: number): boolean {
    if (this.userData.ownedStonkzDB.some(x => x.stonkId === id))
    {
      return true;
    }
    return false;
  }

  getOwnedStonkArray(id: number): OwnedStonkz[] {
    return this.userData.ownedStonkzDB.filter(x => x.stonkId === id);
  }


  
}
