import { Injectable, OnInit, inject, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StonkzData } from './Interfaces/stonkz-data'
import { Stonk } from './Interfaces/stonk';
import { DateComparerService } from './date-comparer.service';


@Injectable({
  providedIn: 'root'
})
export class StonkzService {

  //stonkData: StonkzData[] = [];
  //stonkDataDict: StonkDataDict = {0, []}
  public stonkDataDictReady = new EventEmitter<void>();
  stonkDataDict: Record<number, StonkzData[]> = {};
  stonkData: StonkzData[] = [];
  stonkDataPromise: Promise<StonkzData[]> | null = null;
  stonkz: Stonk[] = [];
  loadingPromise: Promise<Stonk[]> | null = null;
  dateComparer = inject(DateComparerService);

  constructor(private http: HttpClient)
  {
    this.loadStonkz();
    this.loadStonkData().then(() => {
      console.log("loadingStonkData finished. calling dict generation");
      this.generateStonkDataDictionary();
    })
  }

  public checkValue(val: number, addClasses: string | null = null): string {
    let customClass: string = "";
    if (val < 0) {
      customClass += 'red';
    }
    else {
      customClass += 'green';
    }

    if (addClasses !== null) {
      customClass += addClasses;
    }

    return customClass;
  }

  public debugLogArrayLength() {
    console.log("Stonkz Array Length: " + this.stonkz.length);
    console.log("StonkData Array Length: " + this.stonkData.length);
  }

  public getStonkData(stonkId: number): StonkzData[] {
    if (stonkId in this.stonkDataDict) {
      return this.stonkDataDict[stonkId];
    }
    else {
      return [];
    }
  }

  public getStonkDataWithDate(stonkId: number, day: Date): StonkzData | null {
    //console.log(" getting StonkData With Date. the date is: " + day);
    if (stonkId in this.stonkDataDict) {
      for (let i = 0; i < this.stonkDataDict[stonkId].length; i++) {
        if (this.dateComparer.areDatesEqual(day, new Date(this.stonkDataDict[stonkId][i].date))) {
          return this.stonkDataDict[stonkId][i];
        }
      }
    }
    return null;
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
    this.stonkDataDictReady.emit();
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

  getStonkzIDs() {
    return Array.from({ length: this.stonkz.length }, (_, i) => i);
  }

  getStonkzNameById(id: number) {
    for (let i = 0; i < this.stonkz.length; i++) {
      if (this.stonkz[i].stonkId === id) {
        return this.stonkz[i].stonkName;
      }
    }
    return "";
  }

}
