import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  private counterValue = 100;

  public get counter(): number {
    return this.counterValue;
  }

  constructor() {
    console.log('COUNTER SERVICE CONSTRUCTOR');
  }

  public incremet(incrementAmount: number): void {
    this.counterValue = this.counterValue + incrementAmount;
  }
}
