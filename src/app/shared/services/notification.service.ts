import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

/**
 * ==========================================================================
 *  NotificationService
 * ==========================================================================
 *  Poori application ke liye EK hi jagah jahan se saare
 *  success / error / warning / info / delete-confirm messages show hote hain.
 *
 *  Kahin bhi purana alert() ya Swal.fire(...) likhne ki zaroorat nahi.
 *  Bas is service ko inject karo aur neeche diye gaye methods use karo.
 *
 *  Example:
 *    constructor(private notify: NotificationService) {}
 *
 *    this.notify.success('Product saved successfully');
 *    this.notify.error('Something went wrong, please try again');
 *    const ok = await this.notify.confirmDelete('this product');
 *    if (ok) { ...delete logic... }
 * ==========================================================================
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  /** Common toast look & feel - top-right, auto closing, no ugly default popup */
  private toastMixin = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3200,
    timerProgressBar: true,
    didOpen: (el) => {
      el.addEventListener('mouseenter', Swal.stopTimer);
      el.addEventListener('mouseleave', Swal.resumeTimer);
    },
    customClass: {
      popup: 'app-toast-popup'
    }
  });

  private toast(icon: SweetAlertIcon, title: string, text?: string) {
    this.toastMixin.fire({ icon, title, text });
  }

  /** ✅ Green toast - saving / adding / updating success */
  success(message: string, title: string = 'Success') {
    this.toast('success', title, message);
  }

  /** ❌ Red toast - saving / adding / deleting failed, API errors, validation errors */
  error(message: string, title: string = 'Error') {
    this.toast('error', title, message);
  }

  /** ⚠️ Yellow toast - warnings (e.g. missing fields) */
  warning(message: string, title: string = 'Warning') {
    this.toast('warning', title, message);
  }

  /** ℹ️ Blue toast - general info */
  info(message: string, title: string = 'Info') {
    this.toast('info', title, message);
  }

  /**
   * 🗑️ Confirmation dialog before delete.
   * Returns true if user pressed "Yes, delete it".
   *
   * Example:
   *   const confirmed = await this.notify.confirmDelete('this product');
   *   if (!confirmed) return;
   *   this.productsService.deleteProduct(id).subscribe(() => {
   *     this.notify.success('Product deleted successfully');
   *   });
   */
  async confirmDelete(itemName: string = 'this item'): Promise<boolean> {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: `You are about to delete ${itemName}. This action cannot be undone.`,
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      focusCancel: true,
      customClass: {
        popup: 'app-confirm-popup',
        confirmButton: 'app-btn-danger',
        cancelButton: 'app-btn-cancel'
      },
      buttonsStyling: false
    });
    return result.isConfirmed;
  }

  /**
   * Generic yes/no confirmation (for non-delete actions, e.g. "discard changes?")
   */
  async confirm(message: string, title: string = 'Please confirm'): Promise<boolean> {
    const result = await Swal.fire({
      icon: 'question',
      title,
      text: message,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true,
      customClass: {
        popup: 'app-confirm-popup',
        confirmButton: 'app-btn-primary',
        cancelButton: 'app-btn-cancel'
      },
      buttonsStyling: false
    });
    return result.isConfirmed;
  }

  /** Loading / please-wait spinner for long save operations. Call close() when done. */
  loading(message: string = 'Please wait...') {
    Swal.fire({
      title: message,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      customClass: { popup: 'app-toast-popup' },
      didOpen: () => Swal.showLoading()
    });
  }

  close() {
    Swal.close();
  }
}
