import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StonkzData } from './Interfaces/stonkz-data'
import { Stonk } from './Interfaces/stonk';

@Injectable({
  providedIn: 'root'
})
export class StonkzService {

  stonkData: StonkzData[] = [];
  stonkz: Stonk[] = [];
  loadingPromise: Promise<Stonk[]> | null = null;
  constructor(private http: HttpClient)
  {
    this.loadStonkz();
  }

  /*
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
  }*/

  private loadStonkz(): Promise<Stonk[]> {
    if (this.loadingPromise) {
      return this.loadingPromise; 
    }

    this.loadingPromise = new Promise<Stonk[]>((resolve, reject) => {
      this.http.get<Stonk[]>('/stonk').subscribe({
        next: (data) => {
          this.stonkz = data;
          resolve(data);
        },
        error: (err) => {
          console.error("Stonkz Loading Error: ", err);
          reject(err);
        }
      });
    });
    return this.loadingPromise;
  }

  public async getStonkz(): Promise<Stonk[]> {
    if (this.stonkz.length > 0) {
      return this.stonkz;
    }

    return await this.loadStonkz();
  }

  /*
  public getStonkz() {
    if (this.stonkz.length === 0) {
      this.loadStonkz();
    }
    return this.stonkz;
  }*/

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
