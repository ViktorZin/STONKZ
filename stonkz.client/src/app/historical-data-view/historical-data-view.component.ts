import { HttpClient } from '@angular/common/http';
import { Component, OnInit, WritableSignal, signal, effect, inject } from '@angular/core';
import { StonkzData } from '../Interfaces/stonkz-data'
import { Stonk } from '../Interfaces/stonk';
import { StonkzService } from '../stonkz.service';


@Component({
  selector: 'app-historical-data-view',
  imports: [],
  standalone: true,
  template: `
    <p>
      historical-data-view works!
    </p>
  <!--
    <label for="Stonkz">Choose a Stonk: </label>
    @if(stonkz.length > 0) {
      <select name="Stonkz" id="Stonkz" (change)="updateSelectedStonk($event)">
      @for(stonk of stonkz; track stonk.stonkId) {
        <option value="{{stonk.stonkId}}">{{stonk.stonkName}}</option>
      }
      </select>
    }
   -->

   @for(stonk of stonkz; track stonk.stonkId) {
     <p>Stonk: {{stonk.stonkName}}</p>
   }

  `,
  styles: ``
})
export class HistoricalDataViewComponent implements OnInit {

  constructor(private http: HttpClient) { }
  selectedStonk: WritableSignal<number> = signal(1);
  stonkData: StonkzData[] = [];
  stonkz: Stonk[] = [];

  stonkzService = inject(StonkzService);

  /*
  ngOnInit() {
    this.stonkzService.loadStonkz();
  }*/

  
  ngOnInit() {
    console.log("I am in historical Data OnInit, trying to load stonkz");
    //this.stonkzService.loadStonkz();
    //this.stonkz = this.stonkzService.getStonkz();
    this.loadStonkz();
    console.log("Stonkz should be loaded now...");
  }
  
  loadStonkz() {
    console.log("trying to load stonkz");
    this.http.get<Stonk[]>('/stonk').subscribe(
      (result) => {
        this.stonkz = result;
      },
      (error) => {
        console.error(error + " SO EIN ERROR JUNGE");
      }
    );
    console.log("should have loded Stonks. Stonk length: " + this.stonkz.length);
    //return this.stonkz;
  }
  
  
  updateSelectedStonk(event: Event) {
    console.log("DÖÖP");
  }
}
