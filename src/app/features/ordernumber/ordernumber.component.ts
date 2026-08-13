import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Orders, CodeDropDown, OrderNumber } from '../../shared/models/model-classes.model';
import { OrderNumberService } from '../../shared/services/ordernumber.service';

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
  showModal = false;
  showViewModal = false;

  search: any = { orderNumber: '', orderType: '' };

  orderTypeList: CodeDropDown[] = [
    { id: 'ONLINE', text: 'Online' },
    { id: 'POS', text: 'POS' },
    { id: 'DINE_IN', text: 'Dine In' },
    { id: 'TAKEAWAY', text: 'Takeaway' },
    { id: 'DELIVERY', text: 'Delivery' }
  ];

  constructor(private orderService: OrderNumberService) { }

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
    this.showModal = true;
  }

  onView(o: OrderNumber): void {
    this.selectedOrder = o;
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
  }

  onEdit(o: OrderNumber): void {
    this.isEdit = true;
    this.formData = { ...o };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
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
    // The order number input is bound directly via [(ngModel)]="orderList[0].orderNum",
    // so orderList[0] already reflects the latest edited value.
    this.formData.orderNum = this.orderList[0]?.orderNum;
    this.formData.orderNumPk = this.orderList[0]?.orderNumPk;

    this.orderService.saveOrder(this.formData).subscribe({
      next: () => {
        Swal.fire('Success', `Order ${this.isEdit ? 'updated' : 'saved'} successfully!`, 'success');
        this.closeModal();
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
}