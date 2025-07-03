import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StonkzData } from './Interfaces/stonkz-data'
import { Stonk } from './Interfaces/stonk';


@Injectable({
  providedIn: 'root'
})
export class StonkzService {

  //stonkData: StonkzData[] = [];
  //stonkDataDict: StonkDataDict = {0, []}
  stonkDataDict: Record<number, StonkzData[]> = {};
  stonkData: StonkzData[] = [];
  stonkDataPromise: Promise<StonkzData[]> | null = null;
  stonkz: Stonk[] = [];
  loadingPromise: Promise<Stonk[]> | null = null;
  constructor(private http: HttpClient)
  {
    this.loadStonkz();
    this.loadStonkData().then(() => {
      console.log("loadingStonkData finished. calling dict generation");
      this.generateStonkDataDictionary();
    })
  }

  public debugLogArrayLength() {
    console.log("Stonkz Array Length: " + this.stonkz.length);
    console.log("StonkData Array Length: " + this.stonkData.length);
  }

  private generateStonkDataDictionary() {
    console.log("in dict generation. starting.");
    for (let i = 0; i < this.stonkz.length; i++) {
      if (this.stonkz[i].stonkId in this.stonkDataDict) {
        //key Exists
        continue;
      }
      else {
        //key does not Exist.
        this.stonkDataDict[this.stonkz[i].stonkId] = this.stonkData.filter(d => d.stonkId === this.stonkz[i].stonkId);
      }
    }
    console.log("done with dict generation...");
  }


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

  private loadStonkData(): Promise<StonkzData[]> {
    if (this.stonkDataPromise) {
      return this.stonkDataPromise;
    }

    this.stonkDataPromise = new Promise<StonkzData[]>((resolve, reject) => {
      this.http.get<StonkzData[]>('/stonkdata').subscribe({
        next: (data) => {
          this.stonkData = data;
          resolve(data);
        },
        error: (err) => {
          console.error("StonkData Loading Error: ", err);
          reject(err);
        }
      });
    });
    return this.stonkDataPromise;
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

  //public getStonkData(stonkId: number, toDate: Date): StonkzData[] {
    //this.http.get<StonkzData[]>('/stonkdata/' + stonkId + "/" + toDate.getFullYear()
    //  + "/" + toDate.getMonth() + "/" + toDate.getDate()).subscribe(
    //    (result) => {
    //      this.stonkData = result;
    //    },
    //    (error) => {
    //      console.error(error);
    //    }
    //);
    /*
    this.http.get<StonkzData[]>('/stonkdata/' + 5).subscribe(
        (result) => {
          this.stonkData = result;
        },
        (error) => {
          console.error(error);
        }
      );

    return this.stonkData;
    */
 // }
}
