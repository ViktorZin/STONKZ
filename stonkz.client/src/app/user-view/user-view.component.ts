import { Component, inject} from '@angular/core';
import { UserDataService } from '../user-data.service';
import { CommonModule, DatePipe } from '@angular/common';
import { StonkzService } from '../stonkz.service';
import { DateComparerService } from '../date-comparer.service';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [CommonModule],
  template: `
  @if(userData.userDataDB) {
     <p>
      Welcome, User {{userData.userDataDB.userName}}!
    </p>
    <button (click)="resetUserData()">RESET DB USER DATA</button>
    <p>Account Balance: {{userData.userDataDB.accountBalance}} €</p>
    <p>current GameDay: {{userData.gameDay() | date:'EEEE dd.MM.YYYY'}}</p>
    <p>Daily Buy Fee: {{userData.dailyBuyFee}} ||  Daily Sell Fee: {{userData.dailySellFee}}</p>
    <button (click)="progressToNextDay()"> Progress to Next Day </button>

    <details>
      <summary><h3>Owned Stonkz</h3></summary>
      <p>STONK ID ARRAY</p>
               <table>
            <thead>
              <tr>
                <th>Stonk</th>
                <th>Price</th>
                <th>Buy Date</th>
              </tr>
            </thead>
            <tbody>
      @for(entry of stonkzService.getStonkzIDs(); track entry) {
        @if(userData.stonkzWallet[entry + 1]) {
          <!--<p>{{stonkzService.getStonkzNameById(userData.stonkzWallet[entry + 1][0].stonkId)}}</p>-->

              @for(boughtStonk of userData.stonkzWallet[entry+1]; track $index) {
                <tr>
                  <td>{{stonkzService.getStonkzNameById(boughtStonk.stonkId)}}</td>
                  <td>{{boughtStonk.pricePerStonk}} €</td>
                  <td>{{boughtStonk.boughtDate | date:'dd.MM.YYYY'}}</td>
                </tr>
              }

        }

      }
        </tbody>
          </table>
    </details>
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

  progressToNextDay() {
    //this.userData.gameDay.setDate(this.userData.gameDay.getDate() + 1);
    if (this.dateComparer.isLastDayOfMonth(this.userData.gameDay())) {
      this.userData.userDataDB.accountBalance += 100;
    }

    this.userData.dailyBuyFee = true;
    this.userData.dailySellFee = true;

    let nextDay: Date = new Date(this.userData.gameDay());
    nextDay.setDate(nextDay.getDate() + 1);
    this.userData.gameDay.set(nextDay);

    this.userData.saveUserDataToDB();
    this.userData.saveOwnedStonkDataToDB();

    //console.log("Updating GameDay. new Game Day should be: " + nextDay);
  }

  addUserData() {
    //this.userData.setInitialUserData();
  }

  resetUserData() {
    this.userData.resetUserDataToDefault();
  }


  
}
