import { Component, OnInit } from '@angular/core';
import { Supplier } from '../../shared/models/model-classes.model';
import { SupplierService } from '../../shared/services/supplier.service';
import Swal from "sweetalert2";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';


@Component({
  selector: 'app-supplier',
  imports: [CommonModule, FormsModule, TableModule],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.scss'
})
export class SupplierComponent implements OnInit {
  suppliertList: Supplier[] = [];
  suppliertMasterList: Supplier[] = [];
  enabledEdit: any[] = [];
  addFlag = false;
  currentUser: any;
  SupplierService: any;
  fileImport!: File;

  searchCode: string = '';
  searchName: string = '';



  constructor(
    private supplierService: SupplierService) { }

  /* ******************************************************************************** */
  ngOnInit(): void {

    this.loadSuppliers()

  }

  spinnerDataLoad: boolean = false

  loadSuppliers() {
    this.spinnerDataLoad = true;  // 👈 Loader start
    this.supplierService.getSupplierList().subscribe({
      next: (data: Supplier[]) => {
        this.suppliertList = data;
        this.suppliertMasterList = data;
        this.spinnerDataLoad = false; // 👈 Loader stop
      },
      error: (err) => {
        console.error(err);
        this.spinnerDataLoad = false; // 👈 Loader stop
      }
    });
  }


  /* ******************************************************************************** */

  onSave(supplierId: number, row: any) {
    let supplier: Supplier = new Supplier();
    let saveFlag = true;

    // Regex patterns
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]+$/;               // only 11 digit number
    const nameRegex = /^[a-zA-Z0-9\s]+$/;           // letters, numbers & spaces only
    const codeRegex = /^[a-zA-Z0-9]+$/;             // brand code: letters & numbers only

    if (row < 0) {
      // ---------------- ADD ----------------
      supplier.supplierName = (document.getElementById('supplierName-new') as HTMLInputElement).value.trim();
      supplier.supplierCode = (document.getElementById('supplierCode-new') as HTMLInputElement).value.trim();
      supplier.supplierContact = (document.getElementById('supplierContact-new') as HTMLInputElement).value.trim();
      supplier.supplierAddress = (document.getElementById('supplierAddress-new') as HTMLInputElement).value.trim();
      supplier.supplierEmail = (document.getElementById('supplierEmail-new') as HTMLInputElement).value.trim();

    } else {
      // ---------------- EDIT ----------------
      if (!this.enabledEdit[row]) return;

      supplier.supplierId = supplierId; //this.suppliertList[row].supplierId;
      supplier.supplierName = (document.getElementById('supplierName-' + row) as HTMLInputElement).value.trim();
      supplier.supplierCode = (document.getElementById('supplierCode-' + row) as HTMLInputElement).value.trim();
      supplier.supplierContact = (document.getElementById('supplierContact-' + row) as HTMLInputElement).value.trim();
      supplier.supplierAddress = (document.getElementById('supplierAddress-' + row) as HTMLInputElement).value.trim();
      supplier.supplierEmail = (document.getElementById('supplierEmail-' + row) as HTMLInputElement).value.trim();

    //   // 🔴 Duplicate check edit case me (apna current row ignore)
    //   let duplicateFound = this.suppliertList.some(
    //     (s, i) =>
    //       i !== row &&
    //       (
    //         s.supplierName.toLowerCase() === supplier.supplierName.toLowerCase() ||
    //         s.supplierCode.toLowerCase() === supplier.supplierCode.toLowerCase()
    //       )
    //   );
    //   if (duplicateFound) {
    //     Swal.fire('Error', 'Supplier Name or Code Already Exists', 'error');
    //     return;
    //   }
     }

    // ---------------- COMMON VALIDATIONS ----------------
    if (!supplier.supplierName) 
      { saveFlag = false; Swal.fire('WARNING', 'Please Enter Supplier Name', 'warning'); }
    else if (!nameRegex.test(supplier.supplierName)) 
      { saveFlag = false; Swal.fire('WARNING', 'Invalid Name (letters & numbers only)', 'warning'); }

    if (!supplier.supplierCode) { saveFlag = false; Swal.fire('WARNING', 'Please Enter Supplier Code', 'warning'); }
    else if (!codeRegex.test(supplier.supplierCode)) { saveFlag = false; Swal.fire('WARNING', 'Invalid Code (letters & numbers only)', 'warning'); }

    if (!supplier.supplierContact) 
      { saveFlag = false; Swal.fire('WARNING', 'Please Enter Supplier Contact', 'warning'); }
    else if (!phoneRegex.test(supplier.supplierContact)) 
      { saveFlag = false; Swal.fire('WARNING', 'Invalid phone number ', 'warning'); }

    if (!supplier.supplierAddress) { saveFlag = false; Swal.fire('WARNING', 'Please Enter Supplier Address', 'warning'); }

    if (!supplier.supplierEmail) { saveFlag = false; Swal.fire('WARNING', 'Please Enter Supplier Email', 'warning'); }
    else if (!emailRegex.test(supplier.supplierEmail)) { saveFlag = false; Swal.fire('WARNING', 'Invalid Email Format', 'warning'); }

    // ❌ Agar validation fail ho to stop
    if (!saveFlag) return;

    // ---------------- API CALL ----------------
    this.supplierService.saveSupplier(supplier).subscribe(
      (data: Supplier) => {
        if (data && data.supplierId != null) {
          Swal.fire('Submit', `You have saved Supplier ${data.supplierId} successfully!`, 'success').then(() => {
            if (row >= 0) {
              this.enabledEdit[row] = false;
              this.activeRow = null;
            }
          });

          if (row < 0) {
            this.suppliertList.unshift(data); // add new supplier to top
            this.addFlag = false;
          } else {
            this.suppliertList[row] = { ...data }; // update edited supplier
          }
        } else {
          Swal.fire('Error', 'Error in saving Supplier', 'error');
        }
      },
      (error) => {
        console.error('Error saving supplier:', error);
        Swal.fire('Error', 'There was an issue saving the supplier. Please try again.', 'error');
      }
    );
  }



  /* ************************ */
  onDelete(supplierId: number, row: number) {
    Swal.fire({
      title: 'Are you sure want to Delete?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((response: any) => {
      if (response.isConfirmed) {
        this.supplierService.delete(supplierId).subscribe(() => {
        //this.supplierService.delete(this.suppliertList[row].supplierId).subscribe(() => {
          // Remove item from the array without reloading page
          this.suppliertList.splice(row, 1);

          Swal.fire(
            'Deleted!',
            'Supplier has been deleted.',
            'success'
          );
        }, (error) => {
          Swal.fire(
            'Error',
            'Failed to delete supplier. Try again.',
            'error'
          );
        });
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Supplier is safe',
          'error'
        );
      }
    });
  }


  /* ************************ */

  activeRow: number | null = null; // highlight ke liye


  startEdit(row: any) {
    this.enabledEdit = [];
    this.enabledEdit[row] = true;

    this.activeRow = row; // ye row highlight hoga
  }
  /* ************************ */
  addSupplier() {
    this.addFlag = true;
    let supplier: Supplier = new Supplier();//empty supplier

    this.suppliertList.push(supplier);
    this.enabledEdit[this.suppliertList.length - 1] = true;
  }

  /* ************************ */
  importSuppliers() {

    this.supplierService.importSuppliers2().subscribe(() => {
      window.location.reload();
    });

  }

  /* ***************************************************************************** */
  uploadSuppliers(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.fileImport = (files[i]);
    }
    this.supplierService.importSuppliers(this.fileImport).subscribe(() => {
      Swal.fire('SUCCESS', 'Suppliers uploaded Successfully', 'success');

      window.location.reload();
    });

  }
  /* ***************************************************************************** */

  supplierSearch() {
    const code = this.searchCode.trim().toLowerCase();
    const name = this.searchName.trim().toLowerCase();

    this.suppliertList = this.suppliertMasterList.filter(item => {
      const itemCode = item.supplierCode ? item.supplierCode.toString().toLowerCase() : '';
      const itemName = item.supplierName ? item.supplierName.trim().toLowerCase() : '';

      const matchesCode = code ? itemCode.includes(code) : true;
      const matchesName = name ? itemName.includes(name) : true;

      return matchesCode && matchesName;
    });
  }


  backToList() {
    this.addFlag = false;
  }

}
