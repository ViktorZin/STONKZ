import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StonkzData } from './Interfaces/stonkz-data'
import { Stonk } from './Interfaces/stonk';

@Injectable({
  providedIn: 'root'
})
export class StonkzService implements OnInit {

  stonkData: StonkzData[] = [];
  stonkz: Stonk[] = [];
  constructor(private http: HttpClient) { }

  ngOnInit() {
    //this.getStonkz();
    this.loadStonkz();
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

  public getStonkz() {
    if (this.stonkz.length === 0) {
      this.loadStonkz();
    }
    return this.stonkz;
  }

  public getStonkData(stonkId: number, toDate: Date): StonkzData[] {
    //this.http.get<StonkzData[]>('/stonkdata/' + stonkId + "/" + toDate.getFullYear()
    //  + "/" + toDate.getMonth() + "/" + toDate.getDate()).subscribe(
    //    (result) => {
    //      this.stonkData = result;
    //    },
    //    (error) => {
    //      console.error(error);
    //    }
    //);

    this.http.get<StonkzData[]>('/stonkdata/' + 5).subscribe(
        (result) => {
          this.stonkData = result;
        },
        (error) => {
          console.error(error);
        }
      );

    return this.stonkData;
  }
}
