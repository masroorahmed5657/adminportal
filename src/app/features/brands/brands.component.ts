import { Component, OnInit,EventEmitter, Output } from '@angular/core';
import { Brands } from '../../shared/models/model-classes.model';
import { BrandsService } from '../../shared/services/brands.service';
import { NotificationService } from '../../shared/services/notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
//import { window } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-brands',
  imports: [CommonModule, FormsModule, TableModule, OverlayPanelModule, DialogModule,],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit {

  @Output() brandSaved = new EventEmitter<void>();

  brandList: Brands[] = [];
  brandMasterList: Brands[] = [];
  enabledEdit: any[] = [];
  addFlag = false;
  preview = '';
  currentUser: any;
  fileImport!: File;
  brnd: any;
  newBrandName: any;

  spinnerDataLoad: boolean = false;

  /* ===== Pagination (Shopify-style Previous / Next) ===== */
  page: number = 1;
  pageSize: number = 5; // same page size PrimeNG paginator used before

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.brandList.length / this.pageSize));
  }

  get pagedBrandList(): Brands[] {
    const start = (this.page - 1) * this.pageSize;
    return this.brandList.slice(start, start + this.pageSize);
  }

  // Maps the index of a row *within the current page* back to its
  // absolute index inside brandList — needed because startEdit/onSave/onDelete
  // all operate on the full-list index.
  rowIndex(i: number): number {
    return (this.page - 1) * this.pageSize + i;
  }

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.activeRow = null;
  }

  constructor(
    private brandsService: BrandsService,
    private router: Router,
    private notify: NotificationService
  ) { }

  /* ************************ */
  ngOnInit(): void {

    this.loadBrands();

  }

  loadBrands() {
    this.spinnerDataLoad = true;  // 👈 Loader start
    this.brandsService.getBrandsList().subscribe({
      next: (data: Brands[]) => {
        this.brandList = data.reverse();
        this.brandMasterList = data.reverse();
        this.page = 1; // reset to first page on fresh load
        this.spinnerDataLoad = false; // 👈 Loader stop
      },
      error: (err) => {
        console.error(err);
        this.spinnerDataLoad = false; // 👈 Loader stop
        this.notify.error('Could not load brands. Please try again.');
      }
    });
  }

  backToList() {
    this.addFlag = false;
  }

  /* ************************ */
  onSave(brandId: number, row: any) {
    let brand: Brands = new Brands();
    let saveFlag = true;

    if (row < 0) {
      // ADD new brand
      const brandNameInput = document.getElementById('brandName-new') as HTMLInputElement;
      const brandCodeInput = document.getElementById('brandCode-new') as HTMLInputElement;

      brand.brandName = brandNameInput?.value ? brandNameInput.value.trim() : '';
      brand.brandCode = brandCodeInput?.value ? brandCodeInput.value.trim() : '';

      // Validation
      if (!brand.brandName) {
        saveFlag = false;
        this.notify.warning('Please Enter Brand Name');
      }
      if (!brand.brandCode) {
        saveFlag = false;
        this.notify.warning('Please Enter Brand Code');
      }

      /* Date: 2026-08-07
      *  Developer: Masroor Ahmed
      * Validation for brand name
      */

      if (!this.validateData(brand)) {
        return;
      }


      // // ✅ Duplicate check (only if no empty error)
      // if (
      //   saveFlag &&
      //   this.brandList.some(
      //     (b) =>
      //       (b.brandName || '').trim().toLowerCase() === brand.brandName.toLowerCase() ||
      //       (b.brandCode || '').trim().toLowerCase() === brand.brandCode.toLowerCase()
      //   )
      // ) {
      //   saveFlag = false;
      //   this.notify.error('Brand Already Exists');
      //   return;
      // }

    }
    else {
      // EDIT existing brand
      if (!this.enabledEdit[row]) return;

      brand.brandId = brandId; //this.brandList[row].brandId;

      const brandNameInput = document.getElementById('brandName-' + row) as HTMLInputElement;
      const brandCodeInput = document.getElementById('brandCode-' + row) as HTMLInputElement;

      brand.brandName = brandNameInput?.value ? brandNameInput.value.trim() : '';
      brand.brandCode = brandCodeInput?.value ? brandCodeInput.value.trim() : '';

      /* Date: 2026-08-07
      *  Developer: Masroor Ahmed
      * Validation for brand name
      */

      if (!this.validateData(brand)) {
        return;
      }


      if (!brand.brandName) {
        saveFlag = false;
        this.notify.warning('Please Enter Brand Name');
      }

      if (!brand.brandCode) {
        saveFlag = false;
        this.notify.warning('Please Enter Brand Code');
      }

      // // ✅ Duplicate check sirf tab chale jab dono fields empty na ho
      // if (
      //   saveFlag && // ensure empty field case already handled
      //   this.brandList.some(
      //     (b, i) =>
      //       i !== row && ( // apna current row skip karna hoga
      //         (b.brandName || '').trim().toLowerCase() === brand.brandName.toLowerCase() ||
      //         (b.brandCode || '').trim().toLowerCase() === brand.brandCode.toLowerCase()
      //       )
      //   )
      // ) {
      //   saveFlag = false;
      //   this.notify.error('Brand Already Exists');

      //   // 🔙 Restore old values in input
      //   brandNameInput.value = this.brandList[row].brandName;
      //   brandCodeInput.value = this.brandList[row].brandCode;

      //   return; // stop further execution
      // }


      this.enabledEdit[row] = false; // Disable edit after save


    }

    if (!saveFlag) return;

    // Call API
    this.brandsService.save(brand).subscribe(
      (data: Brands) => {
        if (data && data.brandId != null) {
          this.notify.success('You have saved brand ' + data.brandId + ' successfully!');
          this.enabledEdit[row] = false;
          this.activeRow = null; // highlight remove
          // after successful save:
          this.brandSaved.emit();

          if (row < 0) {
            // Add brand to list without reload
            this.brandList.unshift(data); // newest on top
            this.page = 1; // jump to first page so the new brand is visible
          } else {
            // Update existing brand in list
            this.brandList[row] = { ...data };
          }

          this.addFlag = false; // hide add form if open
        } else {
          this.notify.error('Error in saving Brand');
        }
      },
      (error) => {
        console.error('Error saving brand:', error);
        this.notify.error('API Error while saving brand');
      }
    );


  }


  activeRow: number | null = null; // highlight ke liye

  /* ************************ */
  async onDelete(brandId:number, row: number) {
    const confirmed = await this.notify.confirmDelete('this brand');
    if (!confirmed) {
      this.notify.info('Your brand is safe');
      return;
    }

    // Call delete API
    this.brandsService.delete(brandId).subscribe(
      () => {

        this.enabledEdit = [];
        this.activeRow = null

        // Remove brand from the list
        this.brandList.splice(row, 1);

        // Trigger Angular change detection by assigning a new array
        this.brandList = [...this.brandList];

        // If we deleted the last item on the last page, step back a page
        if (this.page > this.totalPages) {
          this.page = this.totalPages;
        }

        this.notify.success('Brand has been deleted.');
      },
      (error) => {
        console.error('Error deleting brand:', error);
        this.notify.error('Failed to delete brand');
      }
    );
  }



  /* ************************ */
  startEdit(row: any) {
    this.enabledEdit = [];
    this.enabledEdit[row] = true;

    this.activeRow = row; // ye row highlight hoga
  }

  /* ************************ */
  showBrandListFlag=true;//Show Always Back To Brand List Button except when calling from Product

  addbrand() {
    this.addFlag = true;
    let brand: Brands = new Brands();//empty dept

    this.brandList.push(brand);
    this.enabledEdit[this.brandList.length - 1] = true;


  }
  /* ************************ */
  uploadBrands(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    this.fileImport = files[0]; // Agar multiple files ka support chahiye to loop bhi kar sakte ho

    this.brandsService.importBrands(this.fileImport).subscribe(
      (uploadedBrands: Brands[]) => {
        this.notify.success('Brands uploaded successfully');

        window.location.reload();

        // // Table me nayi brands add kar do bina reload ke
        // if (uploadedBrands && uploadedBrands.length) {
        //   this.brandList = [...uploadedBrands, ...this.brandList];
        //   this.brandMasterList = [...uploadedBrands, ...this.brandMasterList];
        // }
      },
      (error) => {
        this.notify.error('Failed to upload Brands');
        console.error(error);
      }
    );
  }


  searchCode: string = '';
  searchName: string = '';




  brandSearch() {
    const code = this.searchCode.trim().toLowerCase();
    const name = this.searchName.trim().toLowerCase();

    this.brandList = this.brandMasterList.filter(item => {
      const itemCode = item.brandCode ? item.brandCode.toString().toLowerCase() : '';
      const itemName = item.brandName ? item.brandName.trim().toLowerCase() : '';

      const matchesCode = code ? itemCode.includes(code) : true;
      const matchesName = name ? itemName.includes(name) : true;

      return matchesCode && matchesName;
    });

    this.page = 1; // reset to first page whenever the search changes
  }

  saveBrand() {
    // your save logic here (API call)

    // after successful save:
    this.brandSaved.emit();
  }

  /* ****************************************************************** */
  /* Date: 2026-08-07
  *  Developer: Masroor Ahmed
  * Validation for department name
  */

  validateData(brand: Brands) {
    let bRet = true;
    //Check for duplicate brand Code
    const duplicateCode = this.brandMasterList.find(
      x => x.brandCode === brand.brandCode
    );
    if (duplicateCode) {
      Swal.fire({
        title: 'Brand Code already exists',
        text: 'Please choose a different brand code.',
        icon: 'warning'
      });
      return false;
    }

    //Check for duplicate brand name
    const duplicate = this.brandMasterList.find(
      x => x.brandName?.toLowerCase() === brand.brandName?.toLowerCase()
    );
    if (duplicate) {
      Swal.fire({
        title: 'Brand Name already exists',
        text: 'Please choose a different brand name.',
        icon: 'warning'
      });
      return false;
    }

    //Check for emptry brand name
    if (!brand.brandName || brand.brandName.trim() === '') {
      Swal.fire({
        title: 'Brand Name Required',
        text: 'Please enter a brand name.',
        icon: 'warning'
      });
      return false;
    }
    //Check for emptry brand code
    if (!brand.brandCode || brand.brandCode.trim() === '') {
      Swal.fire({
        title: 'Brand Code Required',
        text: 'Please enter a brand code.',
        icon: 'warning'
      });
      return false;
    }


    //Check for Alphabetic brand name
    //const alphabeticRegex = /^[A-Za-z\s]+$/;
    const alphabeticRegex = /^[A-Za-z][A-Za-z0-9\s]*$/;
    if (!alphabeticRegex.test(brand.brandName)) {
      Swal.fire({
        title: 'Invalid Brand Name',
        text: 'Brand name should contain only alpha numeric characters.',
        icon: 'warning'
      });
      return false;
    }

    //Check for Alphabetic brand name
    //const alphabeticRegex = /^[A-Za-z\s]+$/;
    const alphabeticRegex2 = /^[A-Za-z][A-Za-z0-9\s]*$/;
    if (!alphabeticRegex2.test(brand.brandCode)) {
      Swal.fire({
        title: 'Invalid Brand Code',
        text: 'Brand code should contain only alpha numeric characters.',
        icon: 'warning'
      });
      return false;
    }

    //check for leading ad trailing spaces
    if (brand.brandCode !== brand.brandCode.trim()) {
      Swal.fire({
        title: 'Invalid Brand Code',
        text: 'Brand code should not have leading or trailing spaces.',
        icon: 'warning'
      });
      return false;
    }

    //check for leading ad trailing spaces
    if (brand.brandName !== brand.brandName.trim()) {
      Swal.fire({
        title: 'Invalid Brand Name',
        text: 'Brand name should not have leading or trailing spaces.',
        icon: 'warning'
      });
      return false;
    }
    //Check for special characters in brand code
    const specialCharRegex2 = /[!@#$%^&*(),.?":{}|<>]/;
    if (specialCharRegex2.test(brand.brandCode)) {  
      Swal.fire({
        title: 'Invalid Brand Code',
        text: 'Brand code should not contain special characters.',
        icon: 'warning'
      });
      return false;
    }


    //Check for special characters in brand name
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (specialCharRegex.test(brand.brandName)) {
      Swal.fire({
        title: 'Invalid Brand Name',
        text: 'Brand name should not contain special characters.',
        icon: 'warning'
      });
      return false;
    }
    //Check for brand name length
    if (brand.brandName.length > 50) {
      Swal.fire({
        title: 'Invalid Brand Name',
        text: 'Brand name should not exceed 50 characters.',
        icon: 'warning'
      });
      return false;
    }
    else {
      return true;
    }

  }


}
