import { Injectable } from '@angular/core';

interface OwnedStock {
  stockId: number;
  pricePerStock: number;
  stockCount: number;
  boughtDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  userName: string = "ViktorZin";
  accountBalance: number = 100;
  stockWallet: Record<number, OwnedStock[]> = {};
  gameDay: Date = new Date("2022-01-01");

  constructor() { }


  areDatesEqual(firstDate: Date, secondDate: Date): boolean {
    return (
      firstDate.getFullYear() === secondDate.getFullYear() &&
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getDate() === secondDate.getDate()
    );
  }

  isDateLower(firstDate: Date, secondDate: Date): boolean {
    return (
      firstDate.valueOf() <= secondDate.valueOf()
    );
  }
}
