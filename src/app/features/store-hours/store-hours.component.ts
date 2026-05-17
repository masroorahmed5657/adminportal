import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { StoreServiceService } from '../../shared/services/store-service.service';
import { StoreHours, CodeDropDown } from '../../shared/models/model-classes.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-store-hours',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './store-hours.component.html',
  styleUrls: ['./store-hours.component.scss']
})
export class StoreHoursComponent implements OnInit {
  storeHoursList: StoreHours[] = [];
  originalStoreHoursList: StoreHours[] = []; // 👈 yaha original copy rakhenge

  ampmList: CodeDropDown[] = [
    { id: "AM", text: "AM" },
    { id: "PM", text: "PM" }
  ];

  constructor(private service: StoreServiceService) { }

  ngOnInit(): void {
    this.service.getStoreHoursList().subscribe((data: StoreHours[]) => {
      this.storeHoursList = data.map(item => ({
        ...item,
        storeOpen: item.storeOpen || '',
        storeClose: item.storeClose || '',
        openAmpm: item.openAmpm ? item.openAmpm.toUpperCase() : '',
        closeAmpm: item.closeAmpm ? item.closeAmpm.toUpperCase() : ''
      }));

      // 👇 Original copy banate hain cancel ke liye
      this.originalStoreHoursList = JSON.parse(JSON.stringify(this.storeHoursList));
    });
  }

  // 🔹 Save All
  onSaveAll() {
    const requests = this.storeHoursList.map(hrs => {
      return this.service.saveStoreHour({
        ...hrs,
        openAmpm: hrs.openAmpm ? hrs.openAmpm.toUpperCase() : '',
        closeAmpm: hrs.closeAmpm ? hrs.closeAmpm.toUpperCase() : ''
      });
    });

    forkJoin(requests).subscribe({
      next: () => {
        Swal.fire('Success', 'All Store Hours saved successfully!', 'success');
        this.originalStoreHoursList = JSON.parse(JSON.stringify(this.storeHoursList));
      },
      error: () => {
        Swal.fire('Error', 'Error saving Store Hours', 'error');
      }
    });
  }


  // 🔹 Cancel (revert to original values)
  onCancel() {
    this.storeHoursList = JSON.parse(JSON.stringify(this.originalStoreHoursList));
    Swal.fire('Cancelled', 'Changes reverted!', 'info');
  }
}