import { Component, OnInit, WritableSignal, signal, effect, inject, ViewChild } from '@angular/core';
import { StonkzData } from '../Interfaces/stonkz-data'
import { Stonk } from '../Interfaces/stonk';
import { StonkzService } from '../stonkz.service';
import { CommonModule, DatePipe } from '@angular/common';
import { UserDataService } from '../user-data.service';
import { DateComparerService } from '../date-comparer.service';
import { ActivatedRoute } from '@angular/router';
import { NgApexchartsModule, ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle } from 'ng-apexcharts';


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
}


@Component({
  selector: 'app-historical-data-view',
  imports: [CommonModule, NgApexchartsModule],
  standalone: true,
  template: `
  <hr>
  <div>
    <label for="Stonkz">Choose a Stonk: </label>
    @if(stonkz.length > 0) {
      <select (change)="updateSelectedStonk($event)">
      @for(stonk of stonkz; track stonk.stonkId) {
        <!--<option [value]="{{stonk.stonkId}}">{{stonk.stonkName}}</option>-->
        <option 
        [value]="stonk.stonkId"
        [selected]="stonk.stonkId === selectedStonk()"
        >{{stonk.stonkName}}</option>
      }
      </select>
    }
    <h1>Stonk: {{stonkzService.getStonkzNameById(selectedStonk())}}</h1>
   </div>
   <div>
   <label for="TimeSpan"> Choose Timespan: </label>
   <select (change)="updateSelectedTimespan($event)">
    <option value="all"> All Data</option>
    <option value="7days">Last 7 Days</option>
    <option value="14days">Last 14 Days</option>
    <option value="1month">Last Month</option>
    <option value="6months">Last 6 Months</option>
    <option value="1year">Last Year</option>
   </select>
   </div>

   <div>
   
    <div class="Graph"
    (mouseenter)="setPageScroll(false)"
    (mouseleave)="setPageScroll(true)"
    >
      <apx-chart
      [series]="chartOptions.series"
      [chart]="chartOptions.chart"
      [xaxis]="chartOptions.xaxis"
      [title]="chartOptions.title"></apx-chart>
    </div>
    

  <div class="tableContainer">
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Price</th>
          <th>Change %</th>
          <th>Open</th>
          <th>High</th>
          <th>Low</th>
          <th>Volume</th>

        </tr>
      </thead>  
      <tbody>
      @for(stonkd of filteredStonkData; track stonkd.date) {
        <tr>
          <td>{{stonkd.date | date:'dd.MM.yyyy'}}</td>
          <td class="textPrice">{{stonkd.price}} €</td>
          <td [class]="stonkzService.checkValue(stonkd.changePercentage, ' textRight')">{{stonkd.changePercentage}} %</td>
          <td class="gray">{{stonkd.open}} €</td>
          <td class="gray">{{stonkd.high}} €</td>
          <td class="gray">{{stonkd.low}} €</td>
          <td>{{stonkd.volume}} </td>
          <!--<td>{{stonkd.stonkId}}</td>-->
        </tr>
      }
      </tbody>
    </table>
    </div>
  </div>
  `,
  styles: ``
})
export class HistoricalDataViewComponent implements OnInit {
  requestedStonkDataId: string | null = null;

  @ViewChild("chart") chart!: ChartComponent;

  public chartOptions!: {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    title: ApexTitleSubtitle;
    xaxis: ApexXAxis;
  }

  constructor(private route: ActivatedRoute)
  {
    this.updateChartData();
  }



  selectedStonk: WritableSignal<number> = signal(1);
  stonkData: StonkzData[] = [];
  filteredStonkData: StonkzData[] = [];
  stonkz: Stonk[] = [];

  timespan: number = -1;

  stonkzService = inject(StonkzService);
  userData = inject(UserDataService);
  dateComparer = inject(DateComparerService);

  isInitialized: boolean = false;
  
  async ngOnInit() {
    this.requestedStonkDataId = this.route.snapshot.paramMap.get('id');
    console.log("I am in historical Data OnInit, trying to load stonkz");
    this.stonkz = await this.stonkzService.getStonkz();
    console.log("Stonkz should be loaded now...");

    this.isInitialized = true;
    this.setHistoricalData();
    //this.debugDateCheck();



  }

  updateChartData() {
    this.chartOptions = {
      series: [
        {
          name: "Price",
          data: this.getChartData(),
          color: '#00ffcd'
        }
      ],
      chart: {
        zoom: {
          enabled: true
        },
        height: 500,
        type: "line",
      },
      title: {
        text: ""
      },
      xaxis: {
        categories: this.getChartXAxis()
      }
    };
  }

  updateSelectedTimespan(event: Event) {

    let input: string = String((event.target as HTMLInputElement).value);
    switch (input) {
      case "7days":
        this.timespan = 7;
        break;
      case "14days":
        this.timespan = 14;
        break;
      case "1month":
        this.timespan = 30;
        break;
      case "6months":
        this.timespan = 180;
        break;
      case "1year":
        this.timespan = 365;
        break;
      case "all":
      default:
        this.timespan = -1;
        break;

    }
    this.updateChartData();
  }

  getChartData(): number[] {
    //console.log("Chart Price: " + this.stonkData.map(stonk => stonk.price).slice(0, 12));
    let slicePoint = this.timespan < this.filteredStonkData.length ? this.timespan : this.filteredStonkData.length;
    return this.filteredStonkData.map(stonk => stonk.price).slice(0, slicePoint).reverse();
  }

  getChartXAxis(): string[] {
    let slicePoint = this.timespan < this.filteredStonkData.length ? this.timespan : this.filteredStonkData.length;
    return this.filteredStonkData.map(stonk => stonk.date.split("T")[0]).slice(0, slicePoint).reverse();
  }

  setPageScroll(state: boolean) {
    if (state) {
      document.body.style.overflow = '';
    } else {
      document.body.style.overflow = 'hidden';
    }

  }

  debugDateCheck() {
    console.log("2020-01-01 is smaller than 2025-01-01? = " + this.dateComparer.isDateLower(new Date("2020-01-01"), new Date("2025-01-01")));
    console.log("2024-12-31 is smaller than 2020-01-01? = " + this.dateComparer.isDateLower(new Date("2024-12-31"), new Date("2020-01-01")));
  }

  setHistoricalData() {
    let numId: number = Number(this.requestedStonkDataId);
    if (this.requestedStonkDataId === null) {
      this.selectedStonk.set(1);
    } else if (numId >= 1) {
      this.selectedStonk.set(numId);
    }
    else {
      this.selectedStonk.set(1);
    }
    //this.updateChartData();
  }
  
  
  updateSelectedStonk(event: Event) {
    console.log("Updating selected Stonk");
    let input: number = Number((event.target as HTMLInputElement).value);
    this.selectedStonk.set(input);
  }

  stonkUpdate = effect(() => {
    this.stonkData = [];
    this.filteredStonkData = [];
    this.stonkData = this.stonkzService.getStonkData(this.selectedStonk());
    this.filteredStonkData = this.stonkData.filter(d => this.dateComparer.isDateLower(new Date(d.date), this.userData.gameDay()));
    console.log("I should have stonkData now. stonkdata length: " + this.stonkData.length);
    this.updateChartData();
  })
}
