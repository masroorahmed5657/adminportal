import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor() { }

  // false = expanded, true = collapsed (you can invert if you prefer)
  private collapsed$ = new BehaviorSubject<boolean>(false);

  // observable for components to subscribe
  get isCollapsed$() {
    return this.collapsed$.asObservable();
  }

  // current value
  get isCollapsed(): boolean {
    return this.collapsed$.value;
  }

  toggle() {
    this.collapsed$.next(!this.collapsed$.value);
  }

  setCollapsed(val: boolean) {
    this.collapsed$.next(val);
  }
}
