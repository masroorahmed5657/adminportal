import { Component, OnInit } from '@angular/core';
import { Supplier } from '../../shared/models/model-classes.model';
import { SupplierService } from '../../shared/services/supplier.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { NotificationService } from '../../shared/services/notification.service';


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

  /* ===== Pagination (Shopify-style Previous / Next) ===== */
  page: number = 1;
  pageSize: number = 5; // match whatever "rows" value the old p-table used

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.suppliertList.length / this.pageSize));
  }

  get pagedSupplierList(): Supplier[] {
    const start = (this.page - 1) * this.pageSize;
    return this.suppliertList.slice(start, start + this.pageSize);
  }

  // Maps the index of a row *within the current page* back to its
  // absolute index inside suppliertList — startEdit/onSave/onDelete all
  // operate on the full-list index.
  rowIndex(i: number): number {
    return (this.page - 1) * this.pageSize + i;
  }

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.activeRow = null;
  }

  constructor(
    private supplierService: SupplierService,
    private notify: NotificationService
  ) { }

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
        this.page = 1; // reset to first page on fresh load
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
    }

    // ---------------- COMMON VALIDATIONS ----------------
    //Check for duplicate supplier name or code
    const duplicate = this.suppliertList.find(s => s.supplierCode?.toLowerCase() === supplier.supplierCode?.toLowerCase() && s.supplierId !== supplier.supplierId);

    if (duplicate) {
      this.notify.error('Supplier Code Already Exists');
      return;
    }

    const duplicateName = this.suppliertList.find(s => s.supplierName?.toLowerCase() === supplier.supplierName?.toLowerCase() && s.supplierId !== supplier.supplierId);

    if (duplicateName) {
      this.notify.error('Supplier Name Already Exists');
      return;
    }

    if (!supplier.supplierName) { saveFlag = false; this.notify.warning('Please Enter Supplier Name'); }
    else if (!nameRegex.test(supplier.supplierName)) { saveFlag = false; this.notify.warning('Invalid Name (letters & numbers only)'); }

    if (!supplier.supplierCode) { saveFlag = false; this.notify.warning('Please Enter Supplier Code'); }
    else if (!codeRegex.test(supplier.supplierCode)) { saveFlag = false; this.notify.warning('Invalid Code (letters & numbers only)'); }

    if (!supplier.supplierContact) { saveFlag = false; this.notify.warning('Please Enter Supplier Contact'); }
    else if (!phoneRegex.test(supplier.supplierContact)) { saveFlag = false; this.notify.warning('Invalid phone number '); }

    if (!supplier.supplierAddress) { saveFlag = false; this.notify.warning('Please Enter Supplier Address'); }

    if (!supplier.supplierEmail) { saveFlag = false; this.notify.warning('Please Enter Supplier Email'); }
    else if (!emailRegex.test(supplier.supplierEmail)) { saveFlag = false; this.notify.warning('Invalid Email Format'); }

    // ❌ Agar validation fail ho to stop
    if (!saveFlag) return;

    // ---------------- API CALL ----------------
    this.supplierService.saveSupplier(supplier).subscribe(
      (data: Supplier) => {
        if (data && data.supplierId != null) {
          this.notify.success(`You have saved Supplier ${data.supplierId} successfully!`, 'Submit');

          if (row >= 0) {
            this.enabledEdit[row] = false;
            this.activeRow = null;
          }

          //disable edit mode and refresh list
          this.enabledEdit = [];
          this.activeRow = null;
          this.suppliertList = [...this.suppliertList];
          this.enabledEdit[row] = false;
          this.addFlag = false;
          this.page = 1;
          this.loadSuppliers(); // Refresh the list after save

        }
        else {
          this.notify.error('Error in saving Supplier');
        }
      },
      (error) => {
        console.error('Error saving supplier:', error);
        this.notify.error('There was an issue saving the supplier. Please try again.');
      }
    );
  }



  /* ************************ */
  async onDelete(supplierId: number, row: number) {
    const confirmed = await this.notify.confirmDelete('this supplier');
    if (!confirmed) {
      this.notify.info('Your supplier is safe');
      return;
    }

    this.supplierService.delete(supplierId).subscribe(() => {
      // Remove item from the array without reloading page
      this.suppliertList.splice(row, 1);

      // If we deleted the last item on the last page, step back a page
      if (this.page > this.totalPages) {
        this.page = this.totalPages;
      }

      this.notify.success('Supplier has been deleted.');
    }, (error) => {
      this.notify.error('Failed to delete supplier. Try again.');
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
      this.notify.success('Suppliers uploaded Successfully');

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

    this.page = 1; // reset to first page whenever the search changes
  }


  backToList() {
    this.addFlag = false;
  }

}