import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Orders, CodeDropDown } from '../../shared/models/model-classes.model';
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

  orderList: Orders[] = [];
  formData: Orders = new Orders();
  selectedOrder: Orders | null = null;
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
      next: (data: Orders[]) => this.orderList = data,
      error: () => Swal.fire('Error', 'Failed to load orders', 'error')
    });
  }

  onSearch(): void {
    this.orderService.searchOrders(this.search).subscribe({
      next: (data: Orders[]) => this.orderList = data,
      error: () => Swal.fire('Error', 'Search failed', 'error')
    });
  }

  onClear(): void {
    this.search = { orderNumber: '', orderType: '' };
    this.loadOrders();
  }

  openAddModal(): void {
    this.isEdit = false;
    this.formData = new Orders();
    this.showModal();
  }

  onView(o: Orders): void {
    this.selectedOrder = o;
    const el = document.getElementById('orderViewModal');
    if (el) { this.viewModal = new bootstrap.Modal(el); this.viewModal.show(); }
  }

  onEdit(o: Orders): void {
    this.isEdit = true;
    this.formData = { ...o };
    this.showModal();
  }

  onSave(): void {
    const obs = this.isEdit
      ? this.orderService.updateOrder(this.formData)
      : this.orderService.saveOrder(this.formData);

    obs.subscribe({
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