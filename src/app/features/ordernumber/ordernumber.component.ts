import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Orders, CodeDropDown, OrderNumber } from '../../shared/models/model-classes.model';
import { OrderNumberService } from '../../shared/services/ordernumber.service';


declare var bootstrap: any;

@Component({
  selector: 'app-order-number',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ordernumber.component.html',
  styleUrls: ['./ordernumber.component.scss']
})
export class OrderNumberComponent implements OnInit {

  orderList: OrderNumber[] = [];
  formData: OrderNumber = new OrderNumber();
  selectedOrder: OrderNumber | null = null;
  isEdit = false;
  modal: any;
  viewModal: any;

  search: any = { orderNumber: '', orderType: '' };

  orderTypeList: CodeDropDown[] = [
    { id: 'ONLINE', text: 'Online' },
    { id: 'POS', text: 'POS' },
    { id: 'DINE_IN', text: 'Dine In' },
    { id: 'TAKEAWAY', text: 'Takeaway' },
    { id: 'DELIVERY', text: 'Delivery' }
  ];

  constructor(private orderService: OrderNumberService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (data: OrderNumber[]) => this.orderList = data,
      error: () => Swal.fire('Error', 'Failed to load orders', 'error')
    });
  }

  onSearch(): void {
    this.orderService.searchOrders(this.search).subscribe({
      next: (data: OrderNumber[]) => this.orderList = data,
      error: () => Swal.fire('Error', 'Search failed', 'error')
    });
  }

  onClear(): void {
    this.search = { orderNumber: '', orderType: '' };
    this.loadOrders();
  }

  openAddModal(): void {
    this.isEdit = false;
    this.formData = new OrderNumber();
    this.showModal();
  }

  onView(o: OrderNumber): void {
    this.selectedOrder = o;
    const el = document.getElementById('orderViewModal');
    if (el) { this.viewModal = new bootstrap.Modal(el); this.viewModal.show(); }
  }

  onEdit(o: OrderNumber): void {
    this.isEdit = true;
    this.formData = { ...o };
    this.showModal();
  }
activeRow: number | null = null; // highlight ke liye
enabledEdit: any[] = [];
  // Maps the index of a row *within the current page* back to its
  // absolute index inside brandList — needed because startEdit/onSave/onDelete
  // all operate on the full-list index.
  rowIndex(i: number): number {
    return (this.page - 1) * this.pageSize + i;
  }

    /* ===== Pagination (Shopify-style Previous / Next) ===== */
  page: number = 1;
  pageSize: number = 5; // same page size PrimeNG paginator used before


  onSave(): void {
    // const obs = this.isEdit
    //   ? this.orderService.updateOrder(this.formData)
    //   : this.orderService.saveOrder(this.formData);
    //this.orderList[this.rowIndex(this.orderList.indexOf(this.formData))] = this.formData; // Update the orderList with the new data

    const orderNumInput = document.getElementById('orderNum-' + 0) as HTMLInputElement;  

this.formData.orderNum = orderNumInput.value; // Update the orderNum in formData
this.formData.orderNumPk = this.orderList[0]?.orderNumPk; // Ensure orderNumPk is set correctly

    this.orderService.saveOrder(this.formData).subscribe({
      next: () => {
        Swal.fire('Success', `Order ${this.isEdit ? 'updated' : 'saved'} successfully!`, 'success');
        this.hideModal();
        this.loadOrders();
      },
      error: () => Swal.fire('Error', 'Failed to save order', 'error')
    });
  }

  onDelete(id: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This order will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    }).then(result => {
      if (result.isConfirmed) {
        this.orderService.deleteOrder(id).subscribe({
          next: () => { Swal.fire('Deleted!', 'Order deleted.', 'success'); this.loadOrders(); },
          error: () => Swal.fire('Error', 'Failed to delete', 'error')
        });
      }
    });
  }

  showModal(): void {
    const el = document.getElementById('orderModal');
    if (el) { this.modal = new bootstrap.Modal(el); this.modal.show(); }
  }

  hideModal(): void {
    if (this.modal) this.modal.hide();
  }
}