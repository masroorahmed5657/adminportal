import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Payment, CodeDropDown } from '../../shared/models/model-classes.model';
import { PaymentService } from '../../shared/services/payment.service';
import { NotificationService } from '../../shared/services/notification.service';

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

  constructor(
    private paymentService: PaymentService,
    private notify: NotificationService
  ) { }

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
        this.notify.error('Failed to load payments');
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
        this.notify.error('Search failed');
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
      this.notify.warning('Order ID is required');
      return false;
    }
    if (this.formData.totalAmount === null || this.formData.totalAmount === undefined || this.formData.totalAmount < 0) {
      this.notify.warning('Valid total amount is required');
      return false;
    }
    if (!this.formData.paymentMethod) {
      this.notify.warning('Please select a payment method');
      return false;
    }
    if (!this.formData.paymentStatus) {
      this.notify.warning('Please select a payment status');
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
        this.notify.success(`Payment ${this.isEdit ? 'updated' : 'saved'} successfully!`, 'Success');
        this.isSaving = false;
        this.hideModal();
        this.formData = new Payment();
        this.loadPayments();
      },
      error: () => {
        this.notify.error('Failed to save payment');
        this.isSaving = false;
      }
    });
  }

  async onDelete(id: any) {
    const confirmed = await this.notify.confirmDelete('this payment');
    if (!confirmed) {
      return;
    }

    this.isLoading = true;
    this.paymentService.deletePayment(id).subscribe({
      next: () => {
        this.notify.success('Payment deleted.');
        this.loadPayments();
      },
      error: () => {
        this.notify.error('Failed to delete');
        this.isLoading = false;
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