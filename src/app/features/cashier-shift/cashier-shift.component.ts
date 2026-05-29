import { Component } from '@angular/core';
import { CashierShift } from '../../shared/models/model-classes.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CashierShiftService } from '../../shared/services/cashier-shift.service';
import Swal from "sweetalert2";


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
    private service: CashierShiftService
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
        alert('Shift Updated Successfully');
        this.resetForm();
      },
      (error) => {
        console.error('Error updating shift:', error);
        alert('Failed to update shift');
      }
    );



    // const index = this.shiftsList.findIndex(
    //   x => x.shiftId == this.shift.shiftId
    // );

    // if (index != -1) {

    //   this.shiftsList[index] = {
    //     ...this.shift
    //   };

    //   alert('Shift Updated Successfully');

    //   this.resetForm();
    // }
  }

  deleteShift(item: CashierShift) {

    // if (confirm('Are you sure you want to delete this shift?')) {

    //   this.shiftsList = this.shiftsList.filter(
    //     x => x.shiftId != item.shiftId
    //   );
    // }

 Swal.fire({
      title: `Are you sure want to delete Shift?`,
      text: 'You cannot recover this Shift!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((response: any) => {
      if (response.isConfirmed) {
        // Call delete API
        this.service.delete(item.shiftId).subscribe(
          () => {

                // this.enabledEdit = [];
                // this.activeRow = null

            // Remove shift from the list
            this.shiftsList = this.shiftsList.filter(
              x => x.shiftId != item.shiftId
            );

            // Trigger Angular change detection by assigning a new array
            //this.shiftsList = [...this.shiftsList];

            Swal.fire('Deleted!', 'Shift has been deleted.', 'success');
          },
          (error) => {
            console.error('Error deleting shift:', error);
            Swal.fire('Error', 'Failed to delete shift', 'error');
          }
        );
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your Shift is safe', 'info');
      }
    });

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
