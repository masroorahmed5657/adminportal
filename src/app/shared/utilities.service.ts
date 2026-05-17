import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

  public truncateToTwoDecimals(value: any) {
    if (isNaN(value)) return null; // Check if the input is a valid number
    const parts = value.toString().split(".");
    if (parts.length < 2) return parts[0]; // No decimal part exists
    return parts[0] + "." + parts[1].substring(0, 2); // Truncate to 2 decimal places
  }
}
