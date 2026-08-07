import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Payment, CodeDropDown } from '../../shared/models/model-classes.model';
import { PaymentService } from '../../shared/services/payment.service';

declare var bootstrap: any;

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  paymentList: Payment[] = [];
  formData: Payment = new Payment();
  isEdit = false;
  isSaving = false;
  isLoading = false;
  modal: any;

  search: any = { orderId: '', paymentStatus: '', paymentMethod: '' };

  statusList: CodeDropDown[] = [
    { id: 'PAID', text: 'Paid' },
    { id: 'PENDING', text: 'Pending' },
    { id: 'UNPAID', text: 'Unpaid' },
    { id: 'REFUNDED', text: 'Refunded' },
    { id: 'CANCELLED', text: 'Cancelled' },
    { id: 'FAILED', text: 'Failed' },
    { id: 'PARTIALLY_PAID', text: 'Partially Paid' },
    { id: 'PARTIALLY_REFUNDED', text: 'Partially Refunded' },
    { id: 'COMPLETED', text: 'Completed' },
  ];

  methodList: CodeDropDown[] = [
    { id: 'CASH', text: 'Cash' },
    { id: 'CARD', text: 'Card' },
    { id: 'BANK_TRANSFER', text: 'Bank Transfer' },
    { id: 'ONLINE', text: 'Online' }
  ];

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.isLoading = true;
    this.paymentService.getAllPayments().subscribe({
      next: (data: Payment[]) => {
        this.paymentList = data || [];
        this.isLoading = false;
      },
      error: () => {
        Swal.fire('Error', 'Failed to load payments', 'error');
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    this.isLoading = true;
    this.paymentService.searchPayments(this.search).subscribe({
      next: (data: Payment[]) => {
        this.paymentList = data || [];
        this.isLoading = false;
      },
      error: () => {
        Swal.fire('Error', 'Search failed', 'error');
        this.isLoading = false;
      }
    });
  }

  onClear(): void {
    this.search = { orderId: '', paymentStatus: '', paymentMethod: '' };
    this.loadPayments();
  }

  openAddModal(): void {
    this.isEdit = false;
    this.formData = new Payment();
    this.showModal();
  }

  onEdit(p: Payment): void {
    this.isEdit = true;
    this.formData = { ...p };
    this.showModal();
  }

  private validateForm(): boolean {
    if (!this.formData.orderId?.toString().trim()) {
      Swal.fire('Validation', 'Order ID is required', 'warning');
      return false;
    }
    if (this.formData.totalAmount === null || this.formData.totalAmount === undefined || this.formData.totalAmount < 0) {
      Swal.fire('Validation', 'Valid total amount is required', 'warning');
      return false;
    }
    if (!this.formData.paymentMethod) {
      Swal.fire('Validation', 'Please select a payment method', 'warning');
      return false;
    }
    if (!this.formData.paymentStatus) {
      Swal.fire('Validation', 'Please select a payment status', 'warning');
      return false;
    }
    return true;
  }

  onSave(): void {
    if (!this.validateForm()) return;

    this.isSaving = true;
    const obs = this.isEdit
      ? this.paymentService.updatePayment(this.formData)
      : this.paymentService.savePayment(this.formData);

    obs.subscribe({
      next: () => {
        Swal.fire('Success', `Payment ${this.isEdit ? 'updated' : 'saved'} successfully!`, 'success');
        this.isSaving = false;
        this.hideModal();
        this.formData = new Payment();
        this.loadPayments();
      },
      error: () => {
        Swal.fire('Error', 'Failed to save payment', 'error');
        this.isSaving = false;
      }
    });
  }

  onDelete(id: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This payment will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.paymentService.deletePayment(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Payment deleted.', 'success');
            this.loadPayments();
          },
          error: () => {
            Swal.fire('Error', 'Failed to delete', 'error');
            this.isLoading = false;
          }
        });
      }
    });
  }

  showModal(): void {
    const el = document.getElementById('paymentModal');
    if (el) {
      this.modal = new bootstrap.Modal(el);
      this.modal.show();
    }
  }

  hideModal(): void {
    if (this.modal) this.modal.hide();
  }
}