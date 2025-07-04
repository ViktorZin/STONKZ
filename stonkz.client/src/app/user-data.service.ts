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

  userName: string = "";
  accountBalance: number = 0;
  stonkzWallet: Record<number, OwnedStonkz[]> = {};
  //gameDay: Date = new Date("2022-01-03");
  gameDay: WritableSignal<Date> = signal(new Date("2022-01-03"));
  transactionfee: number = 0;

  dailyBuyFee: boolean = true;
  dailySellFee: boolean = true;


  ownedStonkzDB: OwnedStonkz[] = [];
  userDataDB!: UserData;

  constructor(private http: HttpClient)
  {
    this.loadUserData();

  }

  //Also die Daten laden korrekt rein, aber ich krieg sie nicht weitergereicht
  // / vllt muss ich das Fenster/ die einzelnen Felder neu laden. kein Plan.
  //Ich probier als nächstes nicht mehr die vereinzelnten variables zu verwenden sondern das UserDataDB Field.
  loadUserData() {
    this.http.get<UserData>('/userData').subscribe(
      (result) => {
        this.userDataDB = result;
        console.log("I got a Result.");
        console.log("loeaded Data. now setting UserData from DB");
        this.userName = this.userDataDB.userName;
        this.accountBalance = this.userDataDB.accountBalance;
        this.transactionfee = this.userDataDB.transactionfee;
        //let day: Date = new Date(this.userDataDB.gameDay);
        //this.gameDay.set(this.userDataDB.gameDay);

        console.log(this.userDataDB);

        console.log("UserData is set. lets go!");
      },
      (error) => {
        console.error(error);
      }
    );
  }

  //this is only for creating a User. Once.
  setInitialUserData() {
    let initData: UserData = {
      userName: this.userName,
      accountBalance: this.accountBalance,
      gameDay: new Date(this.gameDay()),
      transactionfee: this.transactionfee
    };
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


  buyStonkz(data: StonkzData) {

    let newStonkz: OwnedStonkz = {
      stonkId: data.stonkId,
      pricePerStonk: data.price,
      boughtDate: new Date(this.gameDay()).toString()
    }

    if (this.dailyBuyFee) {
      this.accountBalance -= this.transactionfee;
      this.dailyBuyFee = false;
    }

    this.accountBalance -= data.price;
    if (data.stonkId in this.stonkzWallet) {

    } else {
      this.stonkzWallet[data.stonkId] = [];
    }

    
    this.stonkzWallet[data.stonkId].push(newStonkz);

    console.log("Now I own " + this.stonkzWallet[data.stonkId].length + " of this stonk!");
  }

  sellStonkz(id: number, currentPrice: number) {
    if (id in this.stonkzWallet) {
      if (this.stonkzWallet[id].length > 0) {

        if (this.dailySellFee) {
          this.accountBalance -= this.transactionfee;
          this.dailySellFee = false;
        }

        this.accountBalance += currentPrice;
        this.stonkzWallet[id].pop();
      }
    } else {
      console.log("ERROR: tried to sell stonkz I do not own!");
    }
  }
  
}
