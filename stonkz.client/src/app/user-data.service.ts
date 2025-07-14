import { Injectable, WritableSignal, signal, effect } from '@angular/core';
import { StonkzData } from './Interfaces/stonkz-data'
import { Stonk } from './Interfaces/stonk';
import { OwnedStonkz } from './Interfaces/owned-stonkz';
import { UserData } from './Interfaces/user-data';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  //gameDay: Date = new Date("2022-01-03");
  gameDay: WritableSignal<Date> = signal(new Date("2022-01-03"));

  dailyBuyFee: boolean = true;
  dailySellFee: boolean = true;

  ownedStonkzDB: OwnedStonkz[] = [];

  sellableStonkz: OwnedStonkz[] = [];
  //ownedStonkzPromise: Promise<OwnedStonkz[]> | null = null;
  userDataDB!: UserData;

  constructor(private http: HttpClient)
  {
    this.loadUserData();
    this.getOwnedStonkzDataFromDB();
  }



  loadUserData() {
    this.http.get<UserData>('/userData').subscribe(
      (result) => {
        this.userDataDB = result;
        //console.log("loeaded Data. now setting UserData from DB");

        //console.log("the date in UserDataDB: " + this.userDataDB.gameDay);
        let day: Date = new Date(this.userDataDB.gameDay);

        //console.log("the userDate converted to DAY: " + day);
        this.gameDay.set(new Date(this.userDataDB.gameDay));
        //console.log("this.gameDay set to DAY: " + this.gameDay());
        //console.log("user ID is: " + this.userDataDB.id);
        //console.log("UserData is set. lets go!");
        console.log("TRANSACTION FEE FROM DB: " + this.userDataDB.transactionFee);
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
      id: 0,
      userName: "ViktorZin",
      accountBalance: 100,
      gameDay: new Date("2022-01-03"),
      transactionFee: 1
    };
    return initData;
  }

  getOwnedStonkzDataFromDB() {
    this.ownedStonkzDB = [];
    console.log("Getting OwnedSTonkzs from DB");
    this.http.get<OwnedStonkz[]>('/ownedStonkz/').subscribe({
      next: (data) => {
        this.ownedStonkzDB = data;
        console.log("Get Successful. Array Length: " + this.ownedStonkzDB.length);
        
      },
      error: (err) => {
        console.error("OwnedStonkz Loading Error: ", err);

      }
    });
  }


  async removeOwnedStonkzFromDB(): Promise<void> {
    if (this.sellableStonkz.length > 0) {
      try {
        let result = await firstValueFrom(
          this.http.delete<OwnedStonkz[]>('/ownedStonkz/', { body: this.sellableStonkz })
        );
        this.sellableStonkz = [];
      } catch (error) {
        console.error("Delete Failed", error);
        throw error;
      }
      /*
      this.http.delete<OwnedStonkz[]>('/ownedStonkz/', { body: this.sellableStonkz }).subscribe({
        next: (data) => {
          console.log("Deletion successful");
          //.ownedStonkzDB = this.ownedStonkzDB.filter(stonk => !this.sellableStonkz.some(del => del.id === stonk.id));
          this.sellableStonkz = [];
        },
        error: (err) => {
          console.error("Delete Failed", err);
        }
      })*/
    }
  }

  buyStonkz(data: StonkzData) {

    let newStonkz: OwnedStonkz = {
      id: 0,
      stonkId: data.stonkId,
      pricePerStonk: data.price,
      boughtDate: new Date(this.gameDay()).toISOString(),
      userId: this.userDataDB.id
    }

    if (this.dailyBuyFee) {
      this.userDataDB.accountBalance -= this.userDataDB.transactionFee;
      this.dailyBuyFee = false;
    }

    this.userDataDB.accountBalance -= data.price;
  
    this.ownedStonkzDB.push(newStonkz);
   
  }

  saveOwnedStonkDataToDB() {
    if (this.ownedStonkzDB.length > 0) {
      console.log("trying to save OwnedStonkzData");
      this.http.post<OwnedStonkz[]>('/ownedStonkz/', this.ownedStonkzDB).subscribe(
        (response: OwnedStonkz[]) => {
          //console.log("Saved OwnedStonkz Data: ", response);
          //this.ownedStonkzDB = [];
          this.ownedStonkzDB = response;
        },
        (error) => {
          console.error(error);
        }
      )
    }
  }

  sellStonkz(id: number, currentPrice: number) {
    if (this.dailySellFee) {
      this.userDataDB.accountBalance -= this.userDataDB.transactionFee;
      this.dailySellFee = false;
    }

    this.userDataDB.accountBalance += currentPrice;
    for (let i = 0; i < this.ownedStonkzDB.length; i++) {
      if (this.ownedStonkzDB[i].stonkId === id) {
        this.sellableStonkz.push(this.ownedStonkzDB[i]);
        //delete this.ownedStonkzDB[i];
        this.ownedStonkzDB.splice(i, 1);
        break;
      }
    }

  }
  
}
