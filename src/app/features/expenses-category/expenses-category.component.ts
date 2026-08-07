import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ExpensesCategoryService } from '../../shared/services/expenses-category.service';
import { ExpenseCategory } from '../../shared/models/model-classes.model';

@Component({
  selector: 'app-expenses-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expenses-category.component.html',
  styleUrls: ['./expenses-category.component.scss']
})
export class ExpensesCategoryComponent implements OnInit {

  // Data
  categoryList: ExpenseCategory[] = [];
  pagedCategoryList: ExpenseCategory[] = [];

  // Search
  searchCode = '';
  searchName = '';

  // Pagination
  page = 1;
  pageSize = 10;
  totalPages = 1;

  // Inline edit tracking (keyed by expenseCategoryId)
  enabledEdit: { [key: number]: boolean } = {};
  activeRow: number | null = null;

  // Flags
  addFlag = false;
  showCategoryListFlag = true;
  spinnerDataLoad = false;
  isSaving = false;

  // New category form model
  newCategory: ExpenseCategory = this.getEmpty();

  constructor(private service: ExpensesCategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  private getEmpty(): ExpenseCategory {
    return {
      expenseCategoryId: null,
      categoryCode: '',
      categoryName: '',
      status: 1
    };
  }

  loadCategories(): void {
    this.spinnerDataLoad = true;
    this.service.getAll().subscribe({
      next: (data) => {
        this.categoryList = data || [];
        this.page = 1;
        this.applyPagination();
        this.spinnerDataLoad = false;
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Failed to load expense categories', 'error');
        this.spinnerDataLoad = false;
      }
    });
  }

  categorySearch(): void {
    this.page = 1;
    this.applyPagination();
  }

  private get filteredList(): ExpenseCategory[] {
    return this.categoryList.filter(cat => {
      const codeMatch = this.searchCode.trim()
        ? (cat.categoryCode || '').toLowerCase().includes(this.searchCode.trim().toLowerCase())
        : true;
      const nameMatch = this.searchName.trim()
        ? (cat.categoryName || '').toLowerCase().includes(this.searchName.trim().toLowerCase())
        : true;
      return codeMatch && nameMatch;
    });
  }

  applyPagination(): void {
    const filtered = this.filteredList;
    this.totalPages = Math.max(1, Math.ceil(filtered.length / this.pageSize));
    if (this.page > this.totalPages) this.page = this.totalPages;
    const start = (this.page - 1) * this.pageSize;
    this.pagedCategoryList = filtered.slice(start, start + this.pageSize);
  }

  goToPage(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages) return;
    this.page = newPage;
    this.applyPagination();
  }

  rowIndex(i: number): number {
    const item = this.pagedCategoryList[i];
    return item?.expenseCategoryId ?? -1;
  }

  startEdit(id: number): void {
    this.enabledEdit[id] = true;
    this.activeRow = id;
  }

  addCategory(): void {
    this.addFlag = true;
    this.showCategoryListFlag = true;
    this.newCategory = this.getEmpty();
  }

  backToList(): void {
    this.addFlag = false;
    this.newCategory = this.getEmpty();
    this.loadCategories();
  }

  onSave(id: number, rowIdx: number): void {
    let payload: ExpenseCategory;

    if (id === -1) {
      if (!this.newCategory.categoryName?.trim()) {
        Swal.fire('Validation', 'Category name is required', 'warning');
        return;
      }
      payload = this.newCategory;
    } else {
      const row = this.categoryList.find(c => c.expenseCategoryId === id);
      if (!row) return;
      if (!row.categoryName?.trim()) {
        Swal.fire('Validation', 'Category name is required', 'warning');
        return;
      }
      payload = row;
    }

    this.isSaving = true;
    this.service.save(payload).subscribe({
      next: () => {
        Swal.fire('Success', 'Expense category saved successfully', 'success');
        this.isSaving = false;
        if (id !== -1) {
          this.enabledEdit[id] = false;
        } else {
          this.addFlag = false;
        }
        this.loadCategories();
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Failed to save category', 'error');
        this.isSaving = false;
      }
    });
  }

  onDelete(id: number, rowIdx?: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This category will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinnerDataLoad = true;
        this.service.delete(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Category has been deleted.', 'success');
            this.loadCategories();
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'Delete failed', 'error');
            this.spinnerDataLoad = false;
          }
        });
      }
    });
  }
}