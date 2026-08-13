import { Component } from '@angular/core';
import { CashierShift } from '../../shared/models/model-classes.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CashierShiftService } from '../../shared/services/cashier-shift.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-cashier-shift',
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './cashier-shift.component.html',
  styleUrl: './cashier-shift.component.scss'
})
export class CashierShiftComponent {
  shift: CashierShift = new CashierShift();

  shiftsList: CashierShift[] = [];

  searchText: string = '';

  constructor(
    private service: CashierShiftService,
    private notify: NotificationService
  ) {
    //this.loadSampleData();
  }

  ngOnInit() {

    this.loadShifts();

  }

  loadShifts() {

    // Call the service to fetch shifts from the backend
    this.service.getList().subscribe(
      (data: CashierShift[]) => {
        this.shiftsList = data;
      },
      (error) => {
        console.error('Error fetching shifts:', error);
      }
    );
  }




  editShift(item: CashierShift) {

    this.shift = {
      ...item
    };
  }

  updateShift() {

    // this.shift.openedAt = this.shift.openedAt + 'T00:00:00';
    // this.shift.closedAt = this.shift.closedAt + 'T00:00:00';

    this.service.save(this.shift).subscribe(
      (updatedShift: CashierShift) => {
        // Update the shift in the list with the response from the backend
        const index = this.shiftsList.findIndex(
          x => x.shiftId == updatedShift.shiftId
        );
        if (index != -1) {
          this.shiftsList[index] = {
            ...updatedShift
          };
        }
        this.notify.success('Shift Updated Successfully');
        this.resetForm();
      },
      (error) => {
        console.error('Error updating shift:', error);
        this.notify.error('Failed to update shift');
      }
    );
  }

  async deleteShift(item: CashierShift) {

    const confirmed = await this.notify.confirmDelete('Shift');
    if (!confirmed) {
      this.notify.info('Your Shift is safe');
      return;
    }

    // Call delete API
    this.service.delete(item.shiftId).subscribe(
      () => {
        // Remove shift from the list
        this.shiftsList = this.shiftsList.filter(
          x => x.shiftId != item.shiftId
        );

        this.notify.success('Shift has been deleted.');
      },
      (error) => {
        console.error('Error deleting shift:', error);
        this.notify.error('Failed to delete shift');
      }
    );

  }

  resetForm() {

    this.shift = new CashierShift();
  }

  filteredShifts() {

    if (!this.searchText) {
      return this.shiftsList;
    }

    return this.shiftsList.filter(x =>
      x.shiftStatus?.toLowerCase()
        .includes(this.searchText.toLowerCase())
      ||
      x.userId?.toString()
        .includes(this.searchText)
    );
  }
}