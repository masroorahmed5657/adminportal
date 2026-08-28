import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { AdminUser, EzpzTax } from '../../shared/models/model-classes.model';
import { EzpzTaxService } from '../../shared/services/ezpz-tax.service';
import { NotificationService } from '../../shared/services/notification.service';

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


  constructor(
    private service: EzpzTaxService,
    private notify: NotificationService
  ) { }

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
        this.notify.error('Failed to load tax records');
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
      this.notify.warning('Tax name is required');
      return;
    }
    if (this.item.tax == null || this.item.tax < 0) {
      this.notify.warning('Valid tax rate is required');
      return;
    }
    if (!this.item.taxType?.trim()) {
      this.notify.warning('Tax type is required');
      return;
    }

    this.isSaving = true;
    const loggedInUser: AdminUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    this.item.updatedBy = loggedInUser?.loginId;

    this.service.save(this.item).subscribe({
      next: () => {
        this.notify.success('Tax saved successfully', 'Success');
        this.onSaveComplete();
      },
      error: (err) => {
        console.error(err);
        this.notify.error('Failed to save tax');
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

  async onDelete(id: number) {
    const confirmed = await this.notify.confirmDelete('this tax record');
    if (!confirmed) {
      return;
    }

    this.isLoading = true;
    this.service.delete(id).subscribe({
      next: () => {
        this.notify.success('Tax has been deleted.');
        this.load();
        if (this.editMode && this.item.taxId === id) {
          this.goToList();
        }
      },
      error: (err) => {
        console.error(err);
        this.notify.error('Delete failed');
        this.isLoading = false;
      }
    });
  }
}