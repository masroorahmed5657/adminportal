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

            /* Date: 2026-08-07
      *  Developer: Masroor Ahmed
      * Validation for Category and Sub Category
      */
      if (!this.validateData(payload)) {
        return;
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


    /* ****************************************************************** */
      /* Date: 2026-08-07
    *  Developer: Masroor Ahmed
    * Validation for department name
    */
  
    validateData(category?: ExpenseCategory): boolean {
      let bRet=true;
  
       //Check for duplicate category name
        const duplicate = this.categoryList.find(
          x => ( (x.categoryCode?.toLowerCase() === category?.categoryCode?.toLowerCase()) && (x.categoryName?.toLowerCase() === category?.categoryName?.toLowerCase()) )
        ); 
        if (duplicate && category?.expenseCategoryId !== duplicate.expenseCategoryId) {
          Swal.fire({
            title: 'Category and Sub-Category Name already exists',
            text: 'Please choose a different Category/Sub-Category name.',
            icon: 'warning'
          });
          return false;
        }
  
        //Check for emptry category name
        if (!category?.categoryName || category.categoryName.trim() === '') {
          Swal.fire({
            title: 'Category Name Required',
            text: 'Please enter a category name.',
            icon: 'warning'
          });
          return false;
        }
        //Check for Alphabetic Category name
        //const alphabeticRegex = /^[A-Za-z\s]+$/;
        const alphabeticRegex = /^[A-Za-z][A-Za-z0-9\s]*$/;
        if (!alphabeticRegex.test(category?.categoryName)) {
          Swal.fire({
            title: 'Invalid Category Name',
            text: 'Category name should contain only alpha numeric characters.',
            icon: 'warning'
          });
          return false;
        }
        //check for leading ad trailing spaces
        if (category?.categoryName !== category?.categoryName.trim()) {
          Swal.fire({
            title: 'Invalid Category Name',
            text: 'Category name should not have leading or trailing spaces.',
            icon: 'warning'
          });
          return false;
        }
        //Check for special characters in category name
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharRegex.test(category?.categoryName)) {
          Swal.fire({
            title: 'Invalid Category Name',
            text: 'Category name should not contain special characters.', 
            icon: 'warning'
          });
          return false;
        }
        //Check for category name length
        if (category?.categoryName.length > 50) {
          Swal.fire({
            title: 'Invalid Category Name',
            text: 'Category name should not exceed 50 characters.', 
            icon: 'warning'
          });
          return false;
        }
        else{ 
          return true;
        }
  
    }
  
}