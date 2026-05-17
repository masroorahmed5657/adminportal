import { Component, OnInit,EventEmitter, Output } from '@angular/core';
import { Brands } from '../../shared/models/model-classes.model';
import { BrandsService } from '../../shared/services/brands.service';
import Swal from "sweetalert2";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
//import { window } from 'rxjs';
import { Router } from '@angular/router';


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

  constructor(
    private brandsService: BrandsService, private router: Router) { }

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
        this.spinnerDataLoad = false; // 👈 Loader stop
      },
      error: (err) => {
        console.error(err);
        this.spinnerDataLoad = false; // 👈 Loader stop
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
        Swal.fire('WARNING', 'Please Enter Brand Name', 'warning');
      }
      if (!brand.brandCode) {
        saveFlag = false;
        Swal.fire('WARNING', 'Please Enter Brand Code', 'warning');
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
      //   Swal.fire('Error', 'Brand Already Exists', 'error');
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

      if (!brand.brandName) {
        saveFlag = false;
        Swal.fire('WARNING', 'Please Enter Brand Name', 'warning');
      }

      if (!brand.brandCode) {
        saveFlag = false;
        Swal.fire('WARNING', 'Please Enter Brand Code', 'warning');
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
      //   Swal.fire('Error', 'Brand Already Exists', 'error');

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
          Swal.fire('Submit', 'You have saved brand ' + data.brandId + ' Successfully!', 'success').then(() => {
            this.enabledEdit[row] = false;
            this.activeRow = null; // highlight remove
            // after successful save:
            this.brandSaved.emit();
          });

          if (row < 0) {
            // Add brand to list without reload
            this.brandList.unshift(data); // newest on top
          } else {
            // Update existing brand in list
            this.brandList[row] = { ...data };
          }

          this.addFlag = false; // hide add form if open
        } else {
          Swal.fire('Error', 'Error in saving Brand', 'error');
        }
      },
      (error) => {
        console.error('Error saving brand:', error);
        Swal.fire('Error', 'API Error while saving brand', 'error');
      }
    );


  }


  activeRow: number | null = null; // highlight ke liye

  /* ************************ */
  onDelete(brandId:number, row: number) {
    Swal.fire({
      title: `Are you sure want to delete Brand?`,
      text: 'You cannot recover this Brand!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((response: any) => {
      if (response.isConfirmed) {
        // Call delete API
        this.brandsService.delete(brandId).subscribe(
          () => {

                this.enabledEdit = [];
                this.activeRow = null

            // Remove brand from the list
            this.brandList.splice(row, 1);

            // Trigger Angular change detection by assigning a new array
            this.brandList = [...this.brandList];

            Swal.fire('Deleted!', 'Brand has been deleted.', 'success');
          },
          (error) => {
            console.error('Error deleting brand:', error);
            Swal.fire('Error', 'Failed to delete brand', 'error');
          }
        );
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your Brand is safe', 'info');
      }
    });
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
        Swal.fire('SUCCESS', 'Brands uploaded Successfully', 'success');

        window.location.reload();

        // // Table me nayi brands add kar do bina reload ke
        // if (uploadedBrands && uploadedBrands.length) {
        //   this.brandList = [...uploadedBrands, ...this.brandList];
        //   this.brandMasterList = [...uploadedBrands, ...this.brandMasterList];
        // }
      },
      (error) => {
        Swal.fire('ERROR', 'Failed to upload Brands', 'error');
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
  }

  saveBrand() {
    // your save logic here (API call)

    // after successful save:
    this.brandSaved.emit();
  }

}
