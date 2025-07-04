import { Injectable, WritableSignal, signal, effect } from '@angular/core';
import { StonkzData } from './Interfaces/stonkz-data'
import { Stonk } from './Interfaces/stonk';
import { OwnedStonkz } from './Interfaces/owned-stonkz';
import { UserData } from './Interfaces/user-data';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  userName: string = "ViktorZin";
  accountBalance: number = 100;
  stonkzWallet: Record<number, OwnedStonkz[]> = {};
  //gameDay: Date = new Date("2022-01-03");
  gameDay: WritableSignal<Date> = signal(new Date("2022-01-03"));
  transactionfee: number = 1;

  dailyBuyFee: boolean = true;
  dailySellFee: boolean = true;

  constructor() { }



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
