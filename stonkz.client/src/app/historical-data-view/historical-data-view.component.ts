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

    <label for="Stonkz">Choose a Stonk: </label>
    @if(stonkz.length > 0) {
      <select name="Stonkz" id="Stonkz" (change)="updateSelectedStonk($event)">
      @for(stonk of stonkz; track stonk.stonkId) {
        <option value="{{stonk.stonkId}}">{{stonk.stonkName}}</option>
      }
      </select>
    }

   <!-- <button (click)="debugStuff()">Array Lengths right now</button> -->
  `,
  styles: ``
})
export class HistoricalDataViewComponent implements OnInit {


  selectedStonk: WritableSignal<number> = signal(1);
  stonkData: StonkzData[] = [];
  stonkz: Stonk[] = [];

  stonkzService = inject(StonkzService);

  /*
  ngOnInit() {
    this.stonkzService.loadStonkz();
  }*/

  debugStuff() {
    console.log("Debugging in HistoricalData.");
    this.stonkzService.debugLogArrayLength();
  }
  
  async ngOnInit() {
    console.log("I am in historical Data OnInit, trying to load stonkz");
    //this.stonkzService.loadStonkz();
    //this.stonkz = this.stonkzService.getStonkz();
    //this.loadStonkz();
    this.stonkz = await this.stonkzService.getStonkz();
    console.log("Stonkz should be loaded now...");
  }
  

  
  
  updateSelectedStonk(event: Event) {
    console.log("DÖÖP");
  }
}
