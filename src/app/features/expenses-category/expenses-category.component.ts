import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';
import { ExpensesCategoryService } from '../../shared/services/expenses-category.service';
import { Categories } from '../../shared/models/model-classes.model';

@Component({
  selector: 'app-expenses-category',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './expenses-category.component.html',
  styleUrls: ['./expenses-category.component.scss']
})
export class ExpensesCategoryComponent implements OnInit {
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
  list: Categories[] = [];
  item: Categories = this.getEmpty();
  viewItem: Categories = this.getEmpty();

  constructor(private service: ExpensesCategoryService) {}

  ngOnInit(): void {
    this.load();
  }

  private getEmpty(): Categories {
    return {
      categoryId: null,
      name: '',
      type: 'EXPENSE',
      isActive: 'Y',
      createdAt: null
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
        Swal.fire('Error', 'Failed to load expense categories', 'error');
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

  get filtered(): Categories[] {
    if (!this.searchTerm.trim()) return this.list;
    const term = this.searchTerm.toLowerCase();
    return this.list.filter(cat =>
      cat.name?.toLowerCase().includes(term) ||
      cat.categoryId?.toString().includes(term)
    );
  }

  add(): void {
    this.showAddFlag = true;
    this.editMode = false;
    this.item = this.getEmpty();
  }

  edit(cat: Categories): void {
    this.showAddFlag = true;
    this.editMode = true;
    this.item = JSON.parse(JSON.stringify(cat));
  }

  view(cat: Categories): void {
    this.viewItem = JSON.parse(JSON.stringify(cat));
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
      Swal.fire('Validation', 'Category name is required', 'warning');
      return;
    }

    this.isSaving = true;
    this.service.save(this.item).subscribe({
      next: () => {
        Swal.fire('Success', 'Expense category saved successfully', 'success');
        this.onSaveComplete();
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Failed to save category', 'error');
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
      text: 'This category will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.service.delete(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Category has been deleted.', 'success');
            this.load();
            if (this.editMode && this.item.categoryId === id) {
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