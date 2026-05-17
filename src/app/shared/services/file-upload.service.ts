import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AppLoggerService } from './app-logger.service';
import { environment } from '../../../environments/environment';
import { Errors } from '../errors/errors'
import { ProductDocuments, ResponseFile } from '../models/model-classes.model';
import { HttpHelperService } from '../helper/base-header.service';
import { HttpMethodService } from '../helper/http-method.service';


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private myUrl = environment.apiUrl;

  constructor(private http: HttpClient,
    private http2: HttpMethodService
  ) { }
  appLogService: AppLoggerService = new AppLoggerService();
  private errors: Errors = new Errors();


  /* ******************************************************************* */
  uploadDBImage2(file: File, productId: any): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('productId', productId);

    const path = `${this.myUrl}` + `productImage/uploadDBImage`;

    const req = new HttpRequest('POST', path, formData, {
      reportProgress: true,
      responseType: 'json',
    });

     return this.http.post(path, formData,
          {
            headers: HttpHelperService.getAuthHeadersForFile()
          });

    //return this.http.request(req);
  }
  /* ******************************************************************* */
  uploadDBImage(file: File, productId: any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('productId', productId);

    return this.http2.uploadProduct(`productImage/uploadDBImage`, file, productId);
  }

  /* ******************************************************************* */
  upload(file: File, productId: any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('productId', productId);

    const req = new HttpRequest('POST', `${this.myUrl}productImage/upload`, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req);
  }
  /* ******************************************************************* */
  uploadAll(fileList: File[], productId: any): Observable<HttpEvent<any>> {

    let response: Observable<HttpEvent<any>> = new Observable;

    for (let i = 0; i < fileList.length; i++) {
      const formData: FormData = new FormData();
      formData.append('file', fileList[i]);
      formData.append('productId', productId);

      const req = new HttpRequest('POST', `${this.myUrl}productImage/upload`, formData, {
        reportProgress: true,
        responseType: 'json',
      });
      response = this.http.request(req);

    }

    return response;
  }
  /* ******************************************************************* */

  getFiles2(): Observable<any> {
    return this.http.get(`${this.myUrl}productImage/files`);
  }

  getFiles(productId: any): Observable<ResponseFile[]> {
    let myUrl = `${this.myUrl}productImage/files` + '/' + productId;
    //return this.http.get(`${this.myUrl}productImage/files`);

    return this.http.get<ResponseFile[]>(myUrl).pipe(
      catchError(this.errors.handleError<ResponseFile[]>('getFiles'))
    );

  }

  getFilesFtp(productId: any): Observable<ResponseFile[]> {
    let myUrl = `${this.myUrl}productImage/filesFtp` + '/' + productId;
    //return this.http.get(`${this.myUrl}productImage/files`);

    return this.http.get<ResponseFile[]>(myUrl).pipe(
      catchError(this.errors.handleError<ResponseFile[]>('getFilesFtp'))
    );

  }

  getImageFilesDB(productId: any): Observable<ResponseFile[]> {
    let myUrl = `${this.myUrl}productImage/imageFilesDB` + '/' + productId;

    return this.http.get<ResponseFile[]>(myUrl).pipe(
      catchError(this.errors.handleError<ResponseFile[]>('getImageFilesDB'))
    );

  }

  /* ******************************************************************* */
  //  DOCUMENT ATTACHMENT
  //
  /* ******************************************************************* */
  getDocuments(productId: any): Observable<ResponseFile[]> {
    let myUrl = `${this.myUrl}productDocuments/files` + '/' + productId;
    //return this.http.get(`${this.myUrl}productImage/files`);

    return this.http.get<ResponseFile[]>(myUrl).pipe(
      catchError(this.errors.handleError<ResponseFile[]>('getDocuments'))
    );
  }

  /* ******************************************************************* */
  uploadDocument(file: File, productId: any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('productId', productId);

    const req = new HttpRequest('POST', `${this.myUrl}productDocuments/uploadFtp`, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req);
  }
  /* ******************************************************************* */
  uploadDocumentAll(fileList: File[], productId: any): Observable<HttpEvent<any>> {

    let response: Observable<HttpEvent<any>> = new Observable;

    for (let i = 0; i < fileList.length; i++) {
      const formData: FormData = new FormData();
      formData.append('file', fileList[i]);
      formData.append('productId', productId);

      const req = new HttpRequest('POST', `${this.myUrl}productDocuments/upload`, formData, {
        reportProgress: true,
        responseType: 'json',
      });
      response = this.http.request(req);

    }

    return response;
  }

  /* ******************************************************************* */
  uploadFtp(file: File, productId: any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('productId', productId);

    const req = new HttpRequest('POST', `${this.myUrl}productImage/uploadFtp`, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req);
  }

  /* ******************************************************************* */
  uploadCSVItems(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.myUrl}productDocuments/csvItemsUpload`, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req);
  }
  /* ******************************************************************* */
  bulkUpdateCSVItems(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.myUrl}productDocuments/productsBulkUpdate`, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req);
  }


}
