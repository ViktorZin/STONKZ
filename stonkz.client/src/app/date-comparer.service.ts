import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateComparerService {

  constructor() { }

  areDatesEqual(firstDate: Date, secondDate: Date): boolean {
    return (
      firstDate.getFullYear() === secondDate.getFullYear() &&
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getDate() === secondDate.getDate()
    );
    /*console.log("COMPARING DATES: \n" + firstDate + "\n" + secondDate);
    if (firstDate.getFullYear() === secondDate.getFullYear() && firstDate.getMonth() === secondDate.getMonth() && firstDate.getDate() === secondDate.getDate()) {
      return true;
    }
    return false;
    */
  }

  isDateLower(firstDate: Date, secondDate: Date): boolean {
    return (
      firstDate.valueOf() <= secondDate.valueOf()
    );
  }
}
