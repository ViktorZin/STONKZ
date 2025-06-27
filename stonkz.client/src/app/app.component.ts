import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { StonkzData } from './Interfaces/stonkz-data';

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

  public stonkz: StonkzData[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getForecasts();
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

  getStonkz() {
    this.http.get<StonkzData[]>('/stonkdata').subscribe(
      (result) => {
        this.stonkz = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  title = 'stonkz.client';
}
