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

  isWeekDay(date: Date): boolean
  {
    if (date.toDateString().includes("Sat") || date.toDateString().includes("Sun")) {
      return false;
    }

    return true;
  }

  isLastDayOfMonth(date: Date): boolean {
    //getMonth() + 1 because it gets Month 0, gives 31 Days, probably because it calculates as December.
    let daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    if (date.getDate() === daysInMonth) {
      console.log("PAYDAY!");
      return true;
    }

    return false;
  }
}
