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
  modal: any;

  search: any = { orderId: '', paymentStatus: '', paymentMethod: '' };

  statusList: CodeDropDown[] = [
    { id: 'PAID', text: 'Paid' },
    { id: 'PENDING', text: 'Pending' },
    { id: 'UNPAID', text: 'Unpaid' },
    { id: 'REFUNDED', text: 'Refunded' }
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
    this.paymentService.getAllPayments().subscribe({
      next: (data: Payment[]) => this.paymentList = data,
      error: () => Swal.fire('Error', 'Failed to load payments', 'error')
    });
  }

  onSearch(): void {
    this.paymentService.searchPayments(this.search).subscribe({
      next: (data: Payment[]) => this.paymentList = data,
      error: () => Swal.fire('Error', 'Search failed', 'error')
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

  onSave(): void {
    const obs = this.isEdit
      ? this.paymentService.updatePayment(this.formData)
      : this.paymentService.savePayment(this.formData);

    obs.subscribe({
      next: () => {
        Swal.fire('Success', `Payment ${this.isEdit ? 'updated' : 'saved'} successfully!`, 'success');
        this.hideModal();
        this.loadPayments();
      },
      error: () => Swal.fire('Error', 'Failed to save payment', 'error')
    });
  }

  onDelete(id: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This payment will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    }).then(result => {
      if (result.isConfirmed) {
        this.paymentService.deletePayment(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Payment deleted.', 'success');
            this.loadPayments();
          },
          error: () => Swal.fire('Error', 'Failed to delete', 'error')
        });
      }
    });
  }

  showModal(): void {
    const el = document.getElementById('paymentModal');
    if (el) { this.modal = new bootstrap.Modal(el); this.modal.show(); }
  }

  hideModal(): void {
    if (this.modal) this.modal.hide();
  }
}