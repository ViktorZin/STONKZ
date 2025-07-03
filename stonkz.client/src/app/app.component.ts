import { Component, OnInit, WritableSignal, signal, effect } from '@angular/core';
import { StonkzData } from './Interfaces/stonkz-data';
import { Stonk } from './Interfaces/stonk';
import { CommonModule, DatePipe } from '@angular/common';
import { HistoricalDataViewComponent } from '../app/historical-data-view/historical-data-view.component';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css',
  imports: [HistoricalDataViewComponent, CommonModule]
})
export class AppComponent  {

  constructor(private http: HttpClient) {
    this.http.get('/weatherforecast').subscribe(
      data => console.log('WeatherForecast was a Success', data),
      err => console.error('Error', err)
    );
  }
  /*
  selectedStonk: WritableSignal<number> = signal(1);
  gameDay: WritableSignal<Date> = signal(new Date());

  public stonkData: StonkzData[] = [];
  public filteredStonkData: StonkzData[] = [];
  public stonkz: Stonk[] = [];

  inputDate = new Date();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getStonkData();
    this.getStonkz();
  }


  getStonkData() {
    //this.http.get<StonkzData[]>('/stonkdata/' + this.selectedStonk()).subscribe(
    this.http.get<StonkzData[]>('/stonkdata/').subscribe(
      (result) => {
        this.stonkData = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getStonkz() {
    this.http.get<Stonk[]>('/stonk').subscribe(
      (result) => {
        this.stonkz = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  updateSelectedStonk(event: Event) {
    let input: number = Number((event.target as HTMLInputElement).value);
    this.selectedStonk.set(input);
  }

  getStonkByID(id: number) {
    return this.stonkz.filter(s => s.stonkId === id)[0];
  }


  stonkUpdate = effect(() => {
    console.log(`The stonkData should update now. new ID: ${this.selectedStonk()}`);

    this.stonkData = [];
    this.getStonkData();
  });

  dateUpdate = effect(() => {
    console.log(`UPDATING STONKDATA BECAUSE OF DATE CHANGE ${this.gameDay()}`);

    //console.log(`I am comparing this.gameDay() ${this.gameDay()} to this.StonkData[0].date: ${this.stonkData[0].date}`);
    console.log("These two should have an identical format... otherwise this will never be true.");

    //this.stonkData = this.stonkData.filter(s => s.date === this.gameDay());
    this.stonkData = this.stonkData.filter(s => this.areDatesEqual(new Date(s.date), this.gameDay()));
  })

  changeDate(event: Event) {
    let newDate = (event.target as HTMLInputElement).value;
    this.gameDay.set(new Date(newDate));
    console.log("newDate: " + newDate);
    console.log(" I pressed on the Date Submit button. ");
  }

  areDatesEqual(firstDate: Date, secondDate: Date): boolean {
    return (
      firstDate.getFullYear() === secondDate.getFullYear() &&
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getDate() === secondDate.getDate()
    );
  }


  */
  title = 'stonkz.client';
}
