import { HttpClient } from '@angular/common/http';
import { Component, OnInit, WritableSignal, signal, effect } from '@angular/core';
import { StonkzData } from './Interfaces/stonkz-data';
import { Stonk } from './Interfaces/stonk';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  public forecasts: WeatherForecast[] = [];

  selectedStonk: WritableSignal<number> = signal(1);


  public stonkData: StonkzData[] = [];
  public stonkz: Stonk[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getForecasts();
    this.getStonkData();
    this.getStonkz();
  }

  getForecasts() {
    this.http.get<WeatherForecast[]>('/weatherforecast').subscribe(
      (result) => {
        this.forecasts = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getStonkData() {
    this.http.get<StonkzData[]>('/stonkdata/' + this.selectedStonk()).subscribe(
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

    /*
    console.log("Input is this: " + input);
    if (typeof input === "string") {
      console.log("Input is a string");
    } else if (typeof input === "number") {
      console.log("Input is a number");
    }
    else {
      console.log("Input is... something...");
    }
    */
    
  }


  stonkUpdate = effect(() => {
    console.log(`The stonkData should update now. new ID: ${this.selectedStonk()}`);

    this.stonkData = [];
    this.getStonkData();
  });

  title = 'stonkz.client';
}
