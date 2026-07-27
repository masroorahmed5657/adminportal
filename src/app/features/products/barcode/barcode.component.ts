import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { environment } from '../../../../environments/environment';
import { BarcodeResponse, URLRequest } from '../../../shared/models/model-classes.model';
import { BarcodesService } from '../../../shared/services/barcodes.service';

/**
 * ===========================================================================
 *  BarcodeComponent — All barcode types on ONE page, Create + Print
 * ===========================================================================
 *  BarcodesService (as given) exposes:
 *    1) getBarCode(barCode)                          -> plain QR (direct http)
 *    2) getQRBarCode(barCode)                         -> plain QR (via httpService)
 *    3) getQRBarCodeURL(urlRequest)                   -> QR generated from a URL
 *    4) get2DBarCode(barCode)                         -> 2D barcode, default size
 *    5) get2DBarCodeWithSize(barCode, width, height)  -> 2D barcode, custom size
 *    6) get2DBarCode8WithSize(barCode, width, height) -> 2D "8" barcode, custom size
 *
 *  This component wraps ALL of them behind one "Barcode Type" dropdown, so
 *  the user just picks a type, fills in the relevant field(s), hits
 *  "Create Barcode", then "Print".
 * ===========================================================================
 */
type BarcodeType = 'qr' | 'qrUrl' | '2d' | '2dSized' | '2d8Sized';

@Component({
  selector: 'app-barcode',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './barcode.component.html',
  styleUrl: './barcode.component.scss'
})
export class BarcodeComponent {

  /* -------- Barcode type selector -------- */
  barcodeType: BarcodeType = 'qr';

  barcodeTypeOptions: { value: BarcodeType; label: string }[] = [
    { value: 'qr', label: 'QR Code (from text / UPC)' },
    { value: 'qrUrl', label: 'QR Code (from a URL)' },
   
   
    { value: '2d8Sized', label: '2D Barcode "8" (custom size)' },
  ];

  /* -------- Input fields -------- */
  code: string = '';        // used by: qr, 2d, 2dSized, 2d8Sized
  url: string = '';         // used by: qrUrl
  width: number = 190;      // used by: 2dSized, 2d8Sized
  height: number = 35;      // used by: 2dSized, 2d8Sized

  labelName: string = '';
  labelPrice: number | null = null;
  copies: number = 1;

  /* -------- State -------- */
  barcodeImage: string = '';
  loading: boolean = false;

  currencySign: string = environment.currencyName === 'PKR' ? 'Rs.' : '$';

  constructor(private barcodeService: BarcodesService) { }

  get needsSize(): boolean {
    return this.barcodeType === '2dSized' || this.barcodeType === '2d8Sized';
  }

  get needsUrl(): boolean {
    return this.barcodeType === 'qrUrl';
  }

  get needsCode(): boolean {
    return !this.needsUrl;
  }

  /* ***************************************************************** */
  /** CREATE: generate the barcode image using whichever type is selected */
  createBarcode() {

    if (this.needsUrl) {
      const urlValue = (this.url || '').trim();
      if (!urlValue) {
        Swal.fire('Missing URL', 'Please enter a URL first', 'warning');
        return;
      }
    } else {
      const value = (this.code || '').trim();
      if (!value) {
        Swal.fire('Missing Code', 'Please enter a UPC / barcode value first', 'warning');
        return;
      }
    }

    this.loading = true;
    this.barcodeImage = '';

    let request$;

    switch (this.barcodeType) {

      case 'qr':
        request$ = this.barcodeService.getQRBarCode(this.code.trim());
        break;

      case 'qrUrl': {
        const urlRequest = { url: this.url.trim() } as URLRequest;
        request$ = this.barcodeService.getQRBarCodeURL(urlRequest);
        break;
      }

      case '2d':
        request$ = this.barcodeService.get2DBarCode(this.code.trim());
        break;

      case '2dSized':
        request$ = this.barcodeService.get2DBarCodeWithSize(this.code.trim(), this.width, this.height);
        break;

      case '2d8Sized':
        request$ = this.barcodeService.get2DBarCode8WithSize(this.code.trim(), this.width, this.height);
        break;
    }

    request$!.subscribe({
      next: (data: BarcodeResponse) => {
        this.barcodeImage = data.image;
        this.loading = false;
      },
      error: (err) => {
        console.error('Barcode generation failed:', err);
        this.loading = false;
        Swal.fire('Error', 'Could not generate barcode', 'error');
      }
    });
  }

  /* ***************************************************************** */
  /** PRINT: print the created barcode, repeated "copies" times */
  printBarcode() {
    if (!this.barcodeImage) {
      Swal.fire('Nothing to Print', 'Please create a barcode first', 'warning');
      return;
    }

    const copiesNum = Math.floor(Number(this.copies));
    const totalCopies = copiesNum > 0 ? copiesNum : 1;
    const price = Number(this.labelPrice ?? 0).toFixed(2);
    const priceLine = this.labelPrice ? `<p class="label-price">${this.currencySign} ${price}</p>` : '';
    const codeLine = this.needsUrl ? this.url : this.code;

    let labelsHtml = '';
    for (let i = 0; i < totalCopies; i++) {
      labelsHtml += `
        <div class="label">
          <p class="label-name">${this.labelName || ''}</p>
          <img src='data:image/png;base64,${this.barcodeImage}'>
          <p class="label-upc">${codeLine}</p>
          ${priceLine}
        </div>`;
    }

    const finalHtml = `
    <html>
      <head>
        <title></title>
        <style>
          @page { size: A4; margin: 10mm; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            display: flex;
            flex-wrap: wrap;
            gap: 4mm;
            font-family: 'Calibri', sans-serif;
          }
          .label {
            width: 63mm;
            height: 38mm;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          .label img { max-width: 90%; height: auto; margin: 2px 0; }
          .label-name {
            font-size: 14px;
            font-family: 'Times New Roman';
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 95%;
          }
          .label-upc {
            font-size: 14px;
            font-weight: bold;
            word-break: break-all;
            max-width: 95%;
          }
          .label-price { font-size: 15px; font-weight: bold; }
        </style>
      </head>
      <body onload="window.print();window.close()">
        ${labelsHtml}
      </body>
    </html>`;

    const popupWin = window.open('', '_blank');
    if (!popupWin) {
      Swal.fire('Error', 'Popup blocked. Please allow popups for this site.', 'error');
      return;
    }
    popupWin.document.open();
    popupWin.document.write(finalHtml);
    popupWin.document.close();
  }

  /* ***************************************************************** */
  clear() {
    this.code = '';
    this.url = '';
    this.labelName = '';
    this.labelPrice = null;
    this.copies = 1;
    this.barcodeImage = '';
  }
}