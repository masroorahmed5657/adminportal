import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }

  private themeMode = new BehaviorSubject<'light' | 'dark'>('light');
  private headerColor = new BehaviorSubject<string>('#FF6713'); // default orange
  private sidebarColor = new BehaviorSubject<string>('#ffffff');

  themeMode$ = this.themeMode.asObservable();
  headerColor$ = this.headerColor.asObservable();
  sidebarColor$ = this.sidebarColor.asObservable();

  toggleTheme() {
    if (this.themeMode.value === 'light') {
      this.themeMode.next('dark');
      this.headerColor.next('#1E1E2D');  // dark mode header = sidebar color
      this.sidebarColor.next('#1E1E2D'); // dark mode sidebar
    } else {
      this.themeMode.next('light');
      this.headerColor.next('#FF6713');  // light mode header = orange
      this.sidebarColor.next('#ffffff'); // light mode sidebar
    }
  }

  get currentTheme() {
    return this.themeMode.value;
  }
}
