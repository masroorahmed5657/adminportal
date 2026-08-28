import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, delay } from 'rxjs';
import { Category, Departments, ProductWrapper } from '../../shared/models/model-classes.model';
import { faBackward, faDashboard, faPlusSquare, faRemove, faDollar, faCar, faUndo } from '@fortawesome/free-solid-svg-icons';
import { ProductService } from '../../shared/services/product.service';
import { DepartmentsService } from '../../shared/services/departments.service';
import { CategoryService } from '../../shared/services/category.service';
import { NotificationService } from '../../shared/services/notification.service';
import { CommonModule, NgClass, NgStyle } from '@angular/common';
import { TableModule } from 'primeng/table';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { ProductsService } from '../../shared/services/products.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  imports: [TableModule, OverlayPanelModule, DialogModule, FormsModule, CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {

  @Output() categorySaved = new EventEmitter<void>();

  newCategory: any;
  newSubCategory: any;

  categoryList: Category[] = [];
  categoryMasterList: Category[] = [];

  enabledEdit: any[] = [];
  deptList: Departments[] = [];
  addFlag = false;
  currentUser: any;
  faUndo = faUndo;
  faBackward = faBackward;
  faDashboard = faDashboard;
  fileImport!: File;

  // variables for IMAGE tab
  selectedFiles?: FileList;
  currentFile: any;
  searchFlag = true;//default

  /* All Images variables */
  progress = 0;
  message = '';
  preview = '';
  imageFlag = false;
  imgFile?: string;
  imageInfos?: Observable<any>;
  image: any;

  value!: Date;
  sortField: any;
  sortOrder: number | undefined;
  endIndex: any = 8;
  first: any = 1;
  breadCrumbItems!: Array<{}>;
  display1!: boolean;
  removeIds: any;
  coupenForm!: UntypedFormGroup;
  deleteModel!: boolean;

  searchCategory: string = '';
  searchSubCategory: string = '';

  spinnerDataLoad: boolean = false;

  /* ===== Pagination (Shopify-style Previous / Next) ===== */
  page: number = 1;
  pageSize: number = 5; // match whatever "rows" value the old p-table used

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.categoryList.length / this.pageSize));
  }

  get pagedCategoryList(): Category[] {
    const start = (this.page - 1) * this.pageSize;
    return this.categoryList.slice(start, start + this.pageSize);
  }

  rowIndex(i: number): number {
    return (this.page - 1) * this.pageSize + i;
  }

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.activeRow = null;
  }

  constructor(
    private productService: ProductsService,
    private deptService: DepartmentsService,
    private categoryService: CategoryService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private notify: NotificationService
  ) { }

  ngOnInit(): void {
    this.spinnerDataLoad = true; // 👈 loader start

    this.deptService.getDepList().subscribe({
      next: (data: Departments[]) => {
        if (data != null || data != undefined) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].activeFlag) {
              this.deptList.push(data[i]);
            }
          }
        }
        this.spinnerDataLoad = false; // 👈 loader stop
      },
      error: (err) => {
        console.error(err);
        this.spinnerDataLoad = false; // 👈 loader stop
      }
    });

    this.getAllCategories();

    console.log('categoryList', this.categoryList);
  }


  getAllCategories() {
    this.spinnerDataLoad = true; // 👈 loader start

    this.categoryService.getCategoryList().subscribe({
      next: (data: Category[]) => {
        this.categoryList = [...data].reverse();
        this.categoryMasterList = [...data].reverse();
        this.page = 1;
        this.spinnerDataLoad = false; // 👈 loader stop
      },
      error: (err) => {
        console.error(err);
        this.spinnerDataLoad = false; // 👈 loader stop
      }
    });
  }

  activeRow: number | null = null;

  startEdit(row: any) {
    this.enabledEdit = []
    this.enabledEdit[row] = true;
    this.activeRow = row;
  }

  showList() {
    this.addFlag = false;
  }

  /************************************************ */

  onSave(categoryId: any, row: number) {
    let category: Category = new Category();
    let saveFlag = true;

    let user = sessionStorage.getItem('currentUser');
    if (user) {
      this.currentUser = JSON.parse(user);
    }

    if (row < 0) {
      const categoryInput = (document.getElementById('category-new') as HTMLInputElement);
      const subCategoryInput = (document.getElementById('subCategory-new') as HTMLInputElement);

      category.category = categoryInput?.value ? categoryInput.value.trim() : '';
      category.subCategory = subCategoryInput?.value ? subCategoryInput.value.trim() : '';
      category.updatedBy = this.currentUser?.loginId || 'system';
      category.activeFlag = 1;

      if (!category.category) {
        saveFlag = false;
        this.notify.warning('Please Enter Category');
      }
      if (!category.subCategory) {
        saveFlag = false;
        this.notify.warning('Please Enter Sub Category');
      }

      /* Date: 2026-08-07
      *  Developer: Masroor Ahmed
      * Validation for Category and Sub Category
      */
      if (!this.validateData(category)) {
        return;
      }


    } else {
      if (!this.enabledEdit[row]) return;

      category.categoryId = categoryId;

      const categoryInput = (document.getElementById('category-' + row) as HTMLInputElement);
      const subCategoryInput = (document.getElementById('subCategory-' + row) as HTMLInputElement);

      category.category = categoryInput?.value ? categoryInput.value.trim() : '';
      category.subCategory = subCategoryInput?.value ? subCategoryInput.value.trim() : '';
      category.popularFlag = ((document.getElementById('popularFlag-' + row)) as HTMLInputElement)?.checked;
      if (category.popularFlag) {
        category.popularFlag = 1;
      } else {
        category.popularFlag = 0;
      }

      category.updatedBy = this.currentUser?.loginId;
      category.activeFlag = 1;

      category.finalImage = this.categoryList[row].finalImage;
      category.imageType = this.categoryList[row].imageType;

      if (!category.category) {
        saveFlag = false;
        this.notify.warning('Please Enter Category');
      }
      if (!category.subCategory) {
        saveFlag = false;
        this.notify.warning('Please Enter Sub Category');
      }

      this.enabledEdit[row] = false;
    }

    if (!saveFlag) return;
    
          /* Date: 2026-08-07
      *  Developer: Masroor Ahmed
      * Validation for Category and Sub Category
      */
      if (!this.validateData(category)) {
        return;
      }



    this.categoryService.saveCategory(category).subscribe(
      (data: Category) => {
        if (data && data.categoryId != null) {
          this.notify.success('You have saved Category ' + data.categoryId + ' Successfully!');

          this.enabledEdit[row] = false;
          this.activeRow = null;
          this.categorySaved.emit();

          if (row < 0) {
            this.categoryList.unshift(data);
            this.categoryMasterList.unshift(data);
            this.page = 1;
          } else {
            this.categoryList[row] = { ...this.categoryList[row], ...data };
          }

          this.addFlag = false;

          if (this.currentFile) {
            this.categoryService.upload(this.currentFile, data.categoryId).subscribe({
              next: (event: any) => {
                if (event instanceof HttpResponse) {
                  const updatedCat = event.body;
                  if (updatedCat && updatedCat.finalImage) {
                    const index = this.categoryList.findIndex(c => c.categoryId === updatedCat.categoryId);
                    if (index > -1) {
                      this.categoryList[index].finalImage = updatedCat.finalImage;
                      this.categoryList[index].imageType = updatedCat.imageType;
                    }
                  }
                  this.preview = '';
                  this.currentFile = null;
                }
              },
              error: (err: any) => {
                console.error(err);
                this.notify.error('Image upload failed!');
              }
            });
          }

        } else {
          this.notify.error('Error in saving Category');
        }
      },
      (error) => {
        console.error('Error saving category:', error);
        this.notify.error('API Error while saving category');
      }
    );
    window.location.reload()
  }


  /* ************************ */
  showCategoryListFlag = true;
  addCategory() {
    this.addFlag = true;
  }

  backToList() {
    this.addFlag = false
  }

  /********************************************* */
  async onDelete(categoryId: any, index: number) {

    const confirmed = await this.notify.confirmDelete('this category');
    if (!confirmed) {
      this.notify.info('Your category is safe');
      return;
    }

    this.productService.getProductsByCategory(categoryId).subscribe((data: ProductWrapper) => {
      let prod1 = data;
      if (prod1.productList.length > 0) {
        this.notify.warning('Category can not be deleted as found Product for this Category');
      }
      else {
        this.categoryService.deleteCategory(categoryId).subscribe({
          next: () => {
            this.enabledEdit = [];
            this.activeRow = null;

            this.categoryList.splice(index, 1);
            this.categoryList = [...this.categoryList];

            if (this.page > this.totalPages) {
              this.page = this.totalPages;
            }

            this.notify.success('Category has been deleted.');
          },
          error: (err) => {
            console.error('Error deleting category:', err);
            this.notify.error('Failed to delete Category');
          }
        });
      }
    });
  }


  /* ********************** IMAGE Methods ******************************* */
  selectFile(event: any): void {
    this.message = '';
    this.preview = '';
    this.progress = 0;
    this.selectedFiles = event.target.files;

    let myRemoveButton = <HTMLButtonElement>(document.getElementById('myRemoveButton'));
    if (myRemoveButton !== null) {
      myRemoveButton.removeAttribute('hidden');
    }

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.preview = '';
        this.currentFile = file;
        if (file.size > 65000) {
          this.notify.warning('Image is too big to upload. Please resize to max 65KB');
          this.currentFile = '';
          this.message = '';
          this.preview = '';
          this.progress = 0;

          return;
        }

        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.preview = e.target.result;
        };

        reader.readAsDataURL(this.currentFile);
      }
    }
  }

  /* ******************************************************************** */
  deleteImage(row: any) {
    this.categoryService.deleteImage(this.categoryList[row].categoryId).subscribe((data: any) => {
      window.location.reload();
    });
  }
  /* ****************************************************************** */

  /* ***************** POPUP Window Code ***************************** */
  displayStyle = "none";
  currentRow = 0;

  openPopup(row: any) {
    this.currentRow = row;
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
  }

  /* ********************************************************************** */
  backToHome() {
    this.router.navigate(['home']);
  }

  onSortChange(event: any) {
    let value = event.target.value;
    if (value == 'low_to_high') {
      this.categoryList.sort((a: any, b: any) => (a.category) - (b.category));
    } else if (value == 'high_to_low') {
      this.categoryList.sort((a: any, b: any) => (b.category) - (a.category));
    } else {
      //this.categoryList = invoice;
    }
  }

  onPageChange(event: any) {
    this.first = event.first + 1;
    if (this.categoryList.length > 0) {
      var last = this.first + event.rows
      if (last <= this.categoryList.length) {
        this.endIndex = event.first + event.rows
      } else {
        this.endIndex = this.categoryList.length
      }
    }
  }

  viewDetail(id: any) { this.router.navigate(['/invoice/overview', this.categoryList[id]]) }

  showPosition(id: any) {
    this.removeIds = id
    this.deleteModel = true
  }

  categorySearch() {
    const category = this.searchCategory.trim().toLowerCase();
    const subCategory = this.searchSubCategory.trim().toLowerCase();

    this.categoryList = this.categoryMasterList.filter(item => {
      const itemCategory = item.category ? item.category.toString().toLowerCase() : '';
      const itemSubCategory = item.subCategory ? item.subCategory.trim().toLowerCase() : '';

      const matchesCategory = itemCategory ? itemCategory.includes(category) : true;
      const matchesSubCategory = itemSubCategory ? itemSubCategory.includes(subCategory) : true;

      return matchesCategory && matchesSubCategory;
    })

    this.page = 1;
  }

  /* ****************************************************************** */
  uploadImage(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.categoryService.upload(this.currentFile, this.categoryList[this.currentRow].categoryId).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 * event.loaded) / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
            }
            window.location.reload();
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the image!';
              this.notify.error('Could not upload the image!');
            }

            this.currentFile = undefined;
          },
        });
      }

      this.selectedFiles = undefined;
    }
  }

  /* ***************************************************************************** */
  uploadCategory(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.fileImport = (files[i]);
    }
    this.categoryService.importCategory(this.fileImport).subscribe(() => {
      this.notify.success('Categories uploaded Successfully');

      window.location.reload();
    });
  }
  /* ****************************************************************** */
    /* Date: 2026-08-07
  *  Developer: Masroor Ahmed
  * Validation for department name
  */

  validateData(category?: Category): boolean {
    let bRet=true;

     //Check for duplicate category name
      const duplicate = this.categoryList.find(
        x => ( (x.category?.toLowerCase() === category?.category?.toLowerCase()) && (x.subCategory?.toLowerCase() === category?.subCategory?.toLowerCase()) )
      ); 
      if (duplicate && category?.categoryId !== duplicate.categoryId) {
        Swal.fire({
          title: 'Category and Sub-Category Name already exists',
          text: 'Please choose a different Category/Sub-Category name.',
          icon: 'warning'
        });
        return false;
      }

      //Check for emptry category name
      if (!category?.category || category.category.trim() === '') {
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
      if (!alphabeticRegex.test(category?.category)) {
        Swal.fire({
          title: 'Invalid Category Name',
          text: 'Category name should contain only alpha numeric characters.',
          icon: 'warning'
        });
        return false;
      }
      //check for leading ad trailing spaces
      if (category?.category !== category?.category.trim()) {
        Swal.fire({
          title: 'Invalid Category Name',
          text: 'Category name should not have leading or trailing spaces.',
          icon: 'warning'
        });
        return false;
      }
      //Check for special characters in category name
      const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
      if (specialCharRegex.test(category?.category)) {
        Swal.fire({
          title: 'Invalid Category Name',
          text: 'Category name should not contain special characters.', 
          icon: 'warning'
        });
        return false;
      }
      //Check for category name length
      if (category?.category.length > 50) {
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