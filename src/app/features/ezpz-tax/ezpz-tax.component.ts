import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';

import { AdminUser, EzpzTax } from '../../shared/models/model-classes.model';
import { EzpzTaxService } from '../../shared/services/ezpz-tax.service';

@Component({
  selector: 'app-ezpz-tax',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './ezpz-tax.component.html',
  styleUrls: ['./ezpz-tax.component.scss']
})
export class EzpzTaxComponent implements OnInit {
  // UI flags
  showAddFlag = false;
  editMode = false;
  isLoading = false;
  isSaving = false;
  showDetailModal = false;

  // Pagination & search
  p = 1;
  searchTerm = '';
  private searchDebounce: any;

  // Data
  list: EzpzTax[] = [];
  item: EzpzTax = this.getEmpty();
  viewItem: EzpzTax = this.getEmpty();
  

  constructor(private service: EzpzTaxService) {}

  ngOnInit(): void {
    
    this.load();
  }

  private getEmpty(): EzpzTax {
    return {
      taxId: null,
      name: '',
      tax: null,
      taxType: '',
      stateCode: '',
      updatedBy: null,
      updatedDate: null
    };
  }

  load(): void {
    this.isLoading = true;
    this.service.getAll().subscribe({
      next: (data) => {
        this.list = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Failed to load tax records', 'error');
        this.isLoading = false;
      }
    });
  }

  onSearchInput(): void {
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      this.p = 1;
    }, 300);
  }

  get filtered(): EzpzTax[] {
    if (!this.searchTerm.trim()) return this.list;
    const term = this.searchTerm.toLowerCase();
    return this.list.filter(tax =>
      tax.name?.toLowerCase().includes(term) ||
      tax.stateCode?.toLowerCase().includes(term) ||
      tax.taxId?.toString().includes(term)
    );
  }

  add(): void {
    this.showAddFlag = true;
    this.editMode = false;
    this.item = this.getEmpty();
  }

  edit(tax: EzpzTax): void {
    this.showAddFlag = true;
    this.editMode = true;
    this.item = JSON.parse(JSON.stringify(tax));
  }

  view(tax: EzpzTax): void {
    this.viewItem = JSON.parse(JSON.stringify(tax));
    this.showDetailModal = true;
  }

  closeDetail(): void {
    this.showDetailModal = false;
  }

  goToList(): void {
    this.showAddFlag = false;
    this.editMode = false;
    this.item = this.getEmpty();
  }

  save(): void {
    if (!this.item.name?.trim()) {
      Swal.fire('Validation', 'Tax name is required', 'warning');
      return;
    }
    if (this.item.tax == null || this.item.tax < 0) {
      Swal.fire('Validation', 'Valid tax rate is required', 'warning');
      return;
    }
    if (!this.item.taxType?.trim()) {
      Swal.fire('Validation', 'Tax type is required', 'warning');
      return;
    }

    this.isSaving = true;
    const loggedInUser: AdminUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    this.item.updatedBy = loggedInUser?.loginId; 

    this.service.save(this.item).subscribe({
      next: () => {
        Swal.fire('Success', 'Tax saved successfully', 'success');
        this.onSaveComplete();
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Failed to save tax', 'error');
        this.isSaving = false;
      }
    });
  }

  private onSaveComplete(): void {
    this.isSaving = false;
    this.showAddFlag = false;
    this.editMode = false;
    this.load();
  }

  onDelete(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This tax record will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.service.delete(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Tax has been deleted.', 'success');
            this.load();
            if (this.editMode && this.item.taxId === id) {
              this.goToList();
            }
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'Delete failed', 'error');
            this.isLoading = false;
          }
        });
      }
    });
  }
}