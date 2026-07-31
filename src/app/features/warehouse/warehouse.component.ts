import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';

import { environment } from '../../../environments/environment';
import { Warehouse, AdminUser } from '../../shared/models/model-classes.model';
import { WarehouseService } from '../../shared/services/warehouse.service';

/**
 * ===========================================================================
 *  WarehouseComponent
 * ===========================================================================
 *  Complete A-to-Z warehouse screen, matching the same "shopify-*" theme
 *  used across the app (products screen etc.):
 *
 *   1) List all warehouses in a table
 *   2) Search / filter (by number, name, city, country)
 *   3) Add new warehouse (modal form)
 *   4) Edit existing warehouse (modal form, pre-filled)
 *   5) Delete warehouse (confirmation dialog)
 *   6) Active / Inactive toggle
 *   7) Expandable row -> shows full address / extra details
 *
 *  WarehousService only exposes: saveWareHouse(), delete(), getWareHouseList()
 *  -> saveWareHouse() is used for BOTH create and update: if the form's
 *     warehouseId is empty/null it's a create, otherwise it's an update.
 * ===========================================================================
 */
@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.scss'
})
export class WarehouseComponent implements OnInit {

  projectName = environment.appName;

  currentUser: any;

  /* -------- Data -------- */
  warehouseList: Warehouse[] = [];
  filteredList: Warehouse[] = [];

  /* -------- UI State -------- */
  loading: boolean = false;
  modalOpen: boolean = false;
  editMode: boolean = false;
  submitted: boolean = false;

  searchTerm: string = '';
  showInactive: boolean = true;

  /* -------- Pagination -------- */
  p: number = 1;
  pageSize: number = 10;

  /* -------- Form -------- */
  warehouseForm: FormGroup = new FormGroup({
    warehouseId: new FormControl(),
    warehouseNbr: new FormControl('', [Validators.required]),
    warehouseName: new FormControl('', [Validators.required]),
    warehouseDescription: new FormControl(),
    subLocation: new FormControl(),
    address: new FormControl(),
    city: new FormControl(),
    stateProvince: new FormControl(),
    country: new FormControl(),
    postalCode: new FormControl(),
    activeFlag: new FormControl(true),
    fromWarehouseId: new FormControl(),
    updatedBy: new FormControl()
  });

  constructor(private warehouseService: WarehouseService) { }

  ngOnInit(): void {
    const user = sessionStorage.getItem('currentUser');
    if (user) {
      this.currentUser = JSON.parse(user);
    }

    this.loadWarehouses();
  }

  /* ***************************************************************** */
  get f(): { [key: string]: AbstractControl } {
    return this.warehouseForm.controls;
  }

  /* ***************************************************************** */
  loadWarehouses() {
    this.loading = true;

    this.warehouseService.getWareHouseList().subscribe({
      next: (data: Warehouse[]) => {
        this.warehouseList = (data || []).map(w => ({ ...w, showDetails: false }));
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading warehouses:', err);
        this.loading = false;
        Swal.fire('Error', 'Could not load warehouse list', 'error');
      }
    });
  }

  /* ***************************************************************** */
  applyFilter() {
    const term = (this.searchTerm || '').trim().toLowerCase();

    this.filteredList = this.warehouseList.filter(w => {
      const matchesActive = this.showInactive ? true : this.isActive(w);

      if (!term) {
        return matchesActive;
      }

      const haystack = [
        w.warehouseNbr, w.warehouseName, w.city, w.country, w.stateProvince, w.subLocation
      ].map(v => (v ?? '').toString().toLowerCase()).join(' ');

      return matchesActive && haystack.includes(term);
    });

    this.p = 1;
  }

  onSearchChange() {
    this.applyFilter();
  }

  toggleShowInactive() {
    this.showInactive = !this.showInactive;
    this.applyFilter();
  }

  /* ***************************************************************** */
  isActive(w: Warehouse): boolean {
    return w.activeFlag === true || w.activeFlag === 1 || w.activeFlag === 'Y' || w.activeFlag === 'A';
  }

  toggleDetails(w: any) {
    w.showDetails = !w.showDetails;
  }

  /* ***************************************************************** */
  /* ------------------------------ Add ------------------------------ */

  onAddWarehouse() {
    this.editMode = false;
    this.submitted = false;
    this.warehouseForm.reset();
    this.warehouseForm.get('activeFlag')?.setValue(true);
    this.modalOpen = true;
  }

  /* ***************************************************************** */
  /* ------------------------------ Edit ------------------------------ */

  onEditWarehouse(w: Warehouse) {
    this.editMode = true;
    this.submitted = false;

    this.warehouseForm.get('warehouseId')?.setValue(w.warehouseId);
    this.warehouseForm.get('warehouseNbr')?.setValue(w.warehouseNbr);
    this.warehouseForm.get('warehouseName')?.setValue(w.warehouseName);
    this.warehouseForm.get('warehouseDescription')?.setValue(w.warehouseDescription);
    this.warehouseForm.get('subLocation')?.setValue(w.subLocation);
    this.warehouseForm.get('address')?.setValue(w.address);
    this.warehouseForm.get('city')?.setValue(w.city);
    this.warehouseForm.get('stateProvince')?.setValue(w.stateProvince);
    this.warehouseForm.get('country')?.setValue(w.country);
    this.warehouseForm.get('postalCode')?.setValue(w.postalCode);
    this.warehouseForm.get('activeFlag')?.setValue(this.isActive(w));
    this.warehouseForm.get('fromWarehouseId')?.setValue(w.fromWarehouseId);
    this.warehouseForm.get('updatedBy')?.setValue(w.updatedBy);
    this.warehouseForm.get('createdBy')?.setValue(w.createdBy);
    this.warehouseForm.get('createdDate')?.setValue(w.createdDate);

    this.modalOpen = true;
  }

  /* ***************************************************************** */
  closeModal() {
    this.modalOpen = false;
    this.submitted = false;
    this.warehouseForm.reset();
  }

  /* ***************************************************************** */
  /* ------------------------------ Save ------------------------------ */

  onSubmit() {
    this.submitted = true;

    if (!this.warehouseForm.valid) {
      return;
    }

    const loggedInUser: AdminUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');

    const warehouse: Warehouse = new Warehouse();
    warehouse.warehouseId = this.warehouseForm.get('warehouseId')?.value;
    warehouse.warehouseNbr = this.warehouseForm.get('warehouseNbr')?.value;
    warehouse.warehouseName = this.warehouseForm.get('warehouseName')?.value;
    warehouse.warehouseDescription = this.warehouseForm.get('warehouseDescription')?.value;
    warehouse.subLocation = this.warehouseForm.get('subLocation')?.value;
    warehouse.address = this.warehouseForm.get('address')?.value;
    warehouse.city = this.warehouseForm.get('city')?.value;
    warehouse.stateProvince = this.warehouseForm.get('stateProvince')?.value;
    warehouse.country = this.warehouseForm.get('country')?.value;
    warehouse.postalCode = this.warehouseForm.get('postalCode')?.value;
    warehouse.activeFlag = this.warehouseForm.get('activeFlag')?.value ? true : false;
    warehouse.fromWarehouseId = this.warehouseForm.get('fromWarehouseId')?.value;
    warehouse.updatedBy = loggedInUser?.loginId;
    warehouse.createdBy = loggedInUser?.loginId;
    warehouse.createdBy = this.warehouseForm.get('createdBy')?.value;
    warehouse.createdDate = this.warehouseForm.get('createdDate')?.value;

    this.loading = true;

    this.warehouseService.saveWareHouse(warehouse).subscribe({
      next: (data) => {
        this.loading = false;
        Swal.fire('Success', `Warehouse "${warehouse.warehouseName}" saved successfully!`, 'success');
        this.closeModal();
        this.loadWarehouses();
      },
      error: (err) => {
        console.error('Error saving warehouse:', err);
        this.loading = false;
        Swal.fire('Error', 'Could not save warehouse', 'error');
      }
    });
  }

  /* ***************************************************************** */
  /* ----------------------------- Delete ----------------------------- */

  onDelete(w: Warehouse) {
    Swal.fire({
      title: 'Are you sure to delete this Warehouse?',
      text: `"${w.warehouseName}" will be permanently removed. This cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((response: any) => {
      if (response.value) {
        this.loading = true;

        this.warehouseService.delete(w.warehouseId).subscribe({
          next: () => {
            this.loading = false;
            Swal.fire('Deleted', 'Warehouse has been deleted', 'success');
            this.loadWarehouses();
          },
          error: (err) => {
            console.error('Error deleting warehouse:', err);
            this.loading = false;
            Swal.fire('Error', 'Could not delete warehouse', 'error');
          }
        });
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your Warehouse is safe', 'error');
      }
    });
  }
}