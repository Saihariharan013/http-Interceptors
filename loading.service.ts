import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LoadingService {

  public loading: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]); // Default value: false

 
  public on(key: string): void {
    this.loading.next([...this.loading.value, key]);
  }

  
  public off(key: string): void {
    this.loading.next(this.loading.value?.filter(f => f != key));
  }

  constructor() {}
}
