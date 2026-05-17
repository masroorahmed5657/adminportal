import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit,EventEmitter, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, delay } from 'rxjs';
import { Category, Departments, ProductWrapper } from '../../shared/models/model-classes.model';
import Swal from 'sweetalert2';
import { faBackward, faDashboard, faPlusSquare, faRemove, faDollar, faCar, faUndo } from '@fortawesome/free-solid-svg-icons';
import { ProductService } from '../../shared/services/product.service';
import { DepartmentsService } from '../../shared/services/departments.service';
import { CategoryService } from '../../shared/services/category.service';
import { CommonModule, NgClass, NgStyle } from '@angular/common';
import { TableModule } from 'primeng/table';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { ProductsService } from '../../shared/services/products.service';

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

  constructor(
    private productService: ProductsService,
    private deptService: DepartmentsService,
    private categoryService: CategoryService,
    private router: Router,
    private formBuilder: UntypedFormBuilder
  ) { }

  ngOnInit(): void {
    this.spinnerDataLoad = true; // 👈 loader start

    // Dept list
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

    // Category list
    this.getAllCategories();

    console.log('categoryList', this.categoryList);

  }


  getAllCategories() {
    this.spinnerDataLoad = true; // 👈 loader start

    // window.location.reload()
    this.categoryService.getCategoryList().subscribe({
      next: (data: Category[]) => {
        // ✅ hamesha naye wale sabse upar
        this.categoryList = [...data].reverse();
        this.categoryMasterList = [...data].reverse();
        this.spinnerDataLoad = false; // 👈 loader stop
      },
      error: (err) => {
        console.error(err);
        this.spinnerDataLoad = false; // 👈 loader stop
      }
    });
  }

  activeRow: number | null = null; // highlight ke liye

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

    // Current user
    let user = sessionStorage.getItem('currentUser');
    if (user) {
      this.currentUser = JSON.parse(user);
    }

    if (row < 0) {
      // ADD new category
      const categoryInput = (document.getElementById('category-new') as HTMLInputElement);
      const subCategoryInput = (document.getElementById('subCategory-new') as HTMLInputElement);

      category.category = categoryInput?.value ? categoryInput.value.trim() : '';
      category.subCategory = subCategoryInput?.value ? subCategoryInput.value.trim() : '';
      category.updatedBy = this.currentUser?.loginId || 'system';
      category.activeFlag = 1;

      // Validation
      if (!category.category) {
        saveFlag = false;
        Swal.fire('WARNING', 'Please Enter Category', 'warning');
      }
      if (!category.subCategory) {
        saveFlag = false;
        Swal.fire('WARNING', 'Please Enter Sub Category', 'warning');
      }

      // // Duplicate check
      // if (category.category 
      //   && category.subCategory && this.categoryList.some(c =>
      //   (c.category || '').trim() === category.category &&
      //   (c.subCategory || '').trim() === category.subCategory
      // )) {
      //   saveFlag = false;
      //   Swal.fire('Error', 'Category Already Exists', 'error');
      // }


    } else 
      {
      // EDIT existing category
      if (!this.enabledEdit[row]) return;

      category.categoryId = categoryId; //this.categoryList[row].categoryId;

      const categoryInput = (document.getElementById('category-' + row) as HTMLInputElement);
      const subCategoryInput = (document.getElementById('subCategory-' + row) as HTMLInputElement);

      category.category = categoryInput?.value ? categoryInput.value.trim() : '';
      category.subCategory = subCategoryInput?.value ? subCategoryInput.value.trim() : '';
      category.popularFlag = ((document.getElementById('popularFlag-' + row) ) as HTMLInputElement)?.checked ;
      if (category.popularFlag)  {
        category.popularFlag=1;
      }
      else{
        category.popularFlag=0;
      }


      category.updatedBy = this.currentUser?.loginId;
      category.activeFlag = 1;

      // ✅ Preserve old image fields
      category.finalImage = this.categoryList[row].finalImage;
      category.imageType = this.categoryList[row].imageType;

      if (!category.category) {
        saveFlag = false;
        Swal.fire('WARNING', 'Please Enter Category', 'warning');
      }
      if (!category.subCategory) {
        saveFlag = false;
        Swal.fire('WARNING', 'Please Enter Sub Category', 'warning');
      }

      this.enabledEdit[row] = false; // Disable edit after save
    }

    if (!saveFlag) return;

    // ✅ Call API
    this.categoryService.saveCategory(category).subscribe(
      (data: Category) => {
        if (data && data.categoryId != null) {
          Swal.fire('Submit', 'You have saved Category ' + data.categoryId + ' Successfully!', 'success').then(() => {

            this.enabledEdit[row] = false;
            this.activeRow = null; // highlight remove
            this.categorySaved.emit();

          });

          // Update frontend list without page reload
          if (row < 0) {
            // ADD case: new category at top
            this.categoryList.unshift(data);
            this.categoryMasterList.unshift(data);
          } else {
            // EDIT case: update existing row
            this.categoryList[row] = { ...this.categoryList[row], ...data };
          }

          this.addFlag = false;

          // ✅ Image upload (if selected)
          if (this.currentFile) {
            this.categoryService.upload(this.currentFile, data.categoryId).subscribe({
              next: (event: any) => {
                if (event instanceof HttpResponse) {
                  const updatedCat = event.body;
                  if (updatedCat && updatedCat.finalImage) {
                    // Update frontend list after image upload
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
                Swal.fire('Error', 'Image upload failed!', 'error');
              }
              
            });
          }

        } else {
          Swal.fire('Error', 'Error in saving Category', 'error');
        }
      },
      (error) => {
        console.error('Error saving category:', error);
        Swal.fire('Error', 'API Error while saving category', 'error');
      }
    );
    window.location.reload()
  }


  /* ************************ */
showCategoryListFlag=true;//Show Always Back To Brand List Button except when calling from Product
addCategory() {
  this.addFlag = true;
}

  backToList() {
    this.addFlag = false
  }

  /********************************************* */
  onDelete(categoryId: any, index: number ) {
  
    let bProductFound = false;

    Swal.fire({
    title: 'Are you sure you want to delete this Category?',
    text: 'You cannot recover this Category!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it'
  }).then((response: any) => {
    if (response.isConfirmed) {

      //First check if this Category exists in Products, then don't delete and show error msg
      this.productService.getProductsByCategory(categoryId).subscribe((data: ProductWrapper)=>{
        let prod1 = data;
        if (prod1.productList.length>0){
          bProductFound=true;
          Swal.fire('WARNING', 'Category can not be deleted as found Product for this Category', 'warning');
        }
        else{
          this.categoryService.deleteCategory(categoryId).subscribe({
            next: () => {
              this.enabledEdit = [];
              this.activeRow = null;

              // ✅ Brands jaisa hi karo
              this.categoryList.splice(index, 1);
              this.categoryList = [...this.categoryList]; // force update

              Swal.fire('Deleted!', 'Category has been deleted.', 'success');
            },
            error: (err) => {
              console.error('Error deleting category:', err);
              Swal.fire('Error', 'Failed to delete Category', 'error');
            }
          });

        }

      });

      
    } else if (response.dismiss === Swal.DismissReason.cancel) {
      Swal.fire('Cancelled', 'Your Category is safe', 'info');
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
          Swal.fire('File Too Big', 'Image is too big to upload. Please resize to max 65KB');
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
    }
    );

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

  // Sorting
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

  // Pagination
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
  }

/* ****************************************************************** */
uploadImage(): void {
  //This upload will work only in EDIT mode. For Add, must do in one transaction
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
              //this.imageInfos = this.uploadService.getFiles(productId);

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
              Swal.fire('Error', 'Could not upload the image!');
            }

            this.currentFile = undefined;
          },
      });

    }

    this.selectedFiles = undefined;
  }

}//upload Image

  /* ***************************************************************************** */
  uploadCategory(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.fileImport = (files[i]);
    }
    this.categoryService.importCategory(this.fileImport).subscribe(() => {
      Swal.fire('SUCCESS', 'Categories uploaded Successfully', 'success');

      window.location.reload();
    });

  }


}