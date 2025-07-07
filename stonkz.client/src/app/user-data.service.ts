import { Injectable, WritableSignal, signal, effect } from '@angular/core';
import { StonkzData } from './Interfaces/stonkz-data'
import { Stonk } from './Interfaces/stonk';
import { OwnedStonkz } from './Interfaces/owned-stonkz';
import { UserData } from './Interfaces/user-data';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  
  stonkzWallet: Record<number, OwnedStonkz[]> = {};
  //gameDay: Date = new Date("2022-01-03");
  gameDay: WritableSignal<Date> = signal(new Date("2022-01-03"));

  dailyBuyFee: boolean = true;
  dailySellFee: boolean = true;

  highestOwnedStonkzId: number = 1;
  ownedStonkzDB: OwnedStonkz[] = [];
  userDataDB!: UserData;

  constructor(private http: HttpClient)
  {
    this.loadUserData();

  }


  loadUserData() {
    this.http.get<UserData>('/userData').subscribe(
      (result) => {
        this.userDataDB = result;
        console.log("loeaded Data. now setting UserData from DB");

        console.log("the date in UserDataDB: " + this.userDataDB.gameDay);
        let day: Date = new Date(this.userDataDB.gameDay);

        console.log("the userDate converted to DAY: " + day);
        this.gameDay.set(new Date(this.userDataDB.gameDay));
        console.log("this.gameDay set to DAY: " + this.gameDay());
        console.log("user ID is: " + this.userDataDB.id);
        console.log("UserData is set. lets go!");
      },
      (error) => {
        console.error(error);
      }
    );
  }

  saveUserDataToDB() {
    this.userDataDB.gameDay = new Date(this.gameDay());
    //console.log("Saving Data to DB. New Date: " + this.userDataDB.gameDay);
    this.http.put<UserData>('/userData/' + this.userDataDB.id, this.userDataDB).subscribe(
      (response) => {
        console.log("UserData Update: ", response);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  //this is only for creating a User. Once.
  setInitialUserData() {
    let initData: UserData = this.getInitialData();
    console.log("POSTING INTO DATABASE!!!");
    this.http.post<UserData>('/userData', initData).subscribe({
      next: (response) => {
        console.log('User Created.', response);
      },
      error: (err) => {
        console.error('Error: ', err);
      }
    });
  }

  resetUserDataToDefault() {
    let initData: UserData = this.getInitialData();
    this.http.put<UserData>('/userData/' + initData.id, initData).subscribe(
      (response) => {
        console.log("UserData Update: ", response);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getInitialData(): UserData {
    let initData: UserData = {
      id: 2,
      userName: "ViktorZin",
      accountBalance: 100,
      gameDay: new Date("2022-01-03"),
      transactionfee: 1
    };
    return initData;
  }


  buyStonkz(data: StonkzData) {

    let newStonkz: OwnedStonkz = {
      id: this.highestOwnedStonkzId,
      stonkId: data.stonkId,
      pricePerStonk: data.price,
      boughtDate: new Date(this.gameDay()).toString(),
      userId: this.userDataDB.id
    }

    this.highestOwnedStonkzId++;

    if (this.dailyBuyFee) {
      this.userDataDB.accountBalance -= this.userDataDB.transactionfee;
      this.dailyBuyFee = false;
    }

    this.userDataDB.accountBalance -= data.price;
    if (data.stonkId in this.stonkzWallet) {

    } else {
      this.stonkzWallet[data.stonkId] = [];
    }

    
    this.stonkzWallet[data.stonkId].push(newStonkz);
    this.ownedStonkzDB.push(newStonkz);
    

    console.log("Now I own " + this.stonkzWallet[data.stonkId].length + " of this stonk!");
  }

  saveOwnedStonkDataToDB() {
    if (this.ownedStonkzDB.length > 0) {
      this.http.post<OwnedStonkz>('/ownedStonkz/', this.ownedStonkzDB).subscribe(
        (response) => {
          console.log("Saved OwnedStonkz Data: ", response);
        },
        (error) => {
          console.error(error);
        }
      )
    }
  }

  sellStonkz(id: number, currentPrice: number) {
    if (id in this.stonkzWallet) {
      if (this.stonkzWallet[id].length > 0) {

        if (this.dailySellFee) {
          this.userDataDB.accountBalance -= this.userDataDB.transactionfee;
          this.dailySellFee = false;
        }

        this.userDataDB.accountBalance += currentPrice;
        this.stonkzWallet[id].pop();
      }
    } else {
      console.log("ERROR: tried to sell stonkz I do not own!");
    }
  }
  
}
