import { Injectable } from '@angular/core';
import { Errors } from '../errors/errors';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { BarcodeResponse, URLRequest } from '../models/model-classes.model';
import { HttpMethodService } from '../helper/http-method.service';

@Injectable({
  providedIn: 'root'
})
export class BarcodesService {

    private myUrl = environment.apiUrl  ; //http://localhost:9080/PAG_WS/

  //cartData= new EventEmitter<Product[] | []>();


  constructor(private http:HttpClient, private httpService: HttpMethodService) { }

  errors: Errors = new Errors();


  /* ************************************************************* */
  getBarCode(barCode: string): Observable<BarcodeResponse>{
  
    let myUrl = `${this.myUrl}` + `barcodes/qr/` + barCode ;
  
    return this.http.get<BarcodeResponse>(myUrl).pipe(
        //tap( error ==> this.log('Fetched Product') ),
      catchError(this.errors.handleError<BarcodeResponse>('getProducts'))
    );
  
  }
    /* ************************************************************* */
    getQRBarCodeURL(urlRequest: URLRequest): Observable<BarcodeResponse> {
  
  // fetch("http://localhost:8080/api/parse", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ url: encodedUrl })
  // });
  
      return this.http.post<BarcodeResponse>(`barcodes/qrUrl`, urlRequest );
  
    }
  
    getQRBarCode(barCode: string): Observable<BarcodeResponse> {
  
      // let myUrl = `${this.myUrl}` + `barcodes/qr/` + barCode;
  
      return this.httpService.get<BarcodeResponse>(`barcodes/qr/` + barCode)
  
    }
    /* ************************************************************* */
  
    get2DBarCode(barCode: string): Observable<BarcodeResponse> {
  
      // let myUrl = `${this.myUrl}` + `barcodes/2d/` + barCode;
  
      return this.httpService.get<BarcodeResponse>(`barcodes/2d/` + barCode)
  
    }
    /* ************************************************************* */
  
    get2DBarCodeWithSize(barCode: string, width: number, height: number): Observable<BarcodeResponse> {
  
      // let myUrl = `${this.myUrl}` + `barcodes/get2DBarcodeWithSize/` + barCode + '/' + width + '/' + height;
  
      return this.httpService.get<BarcodeResponse>(`barcodes/get2DBarcodeWithSize/` + barCode + '/' + width + '/' + height)
  
    }
    /* **************************************************************** */
    get2DBarCode8WithSize(barCode: string, width: number, height: number): Observable<BarcodeResponse> {
  
      // let myUrl = `${this.myUrl}` + `barcodes/get2DBarcode8WithSize/` + barCode + '/' + width + '/' + height;
  
      return this.httpService.get<BarcodeResponse>(`barcodes/get2DBarcode8WithSize/` + barCode + '/' + width + '/' + height)
  
    }
  
  
  
}
