import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Errors } from '../errors/errors';
import { NewsTracker, QurbaniResponse } from '../models/model-classes.model';
import { HttpMethodService } from '../helper/http-method.service';

@Injectable({
  providedIn: 'root'
})
export class NewstrackerService {

  //private myUrl = environment.apiUrl ; //http://localhost:8082/FASHION_API/
  errors: Errors = new Errors();

  constructor(private http: HttpMethodService) {
    // super('brands');
    // http.setEndpoint('brands');
  }


  //constructor(private http:HttpClient) { }

 /* ************************************************************* */

 getNewsTrackerList(): Observable<NewsTracker[]>{

    //let myUrl = `${this.myUrl}` + `newsTracker/findAll` ;
    let myUrl = `newsTracker/findAll` ;

    return this.http.get<NewsTracker[]>(myUrl).pipe(
      //tap( error ==> this.log('Save saveOrders') ),
    catchError(this.errors.handleError<NewsTracker[]>('getNewsTracker findAll'))
    );

  }

/* ************************************************************* */

  delete(newsId: number): Observable<any>{

    let myUrl = `newsTracker/delete/` + newsId;

    return this.http.post<any>(myUrl, newsId).pipe(
        //tap( error ==> this.log('delete delete') ),
      catchError(this.errors.handleError<any>('delete'))
    );

  }
/* ************************************************************* */
save(newsTracker: NewsTracker): Observable<NewsTracker>{

 //return this.http.post<NewsTracker>('newsTracker/save', newsTracker);

  let myUrl =  `newsTracker/save`  ;

  return this.http.post<NewsTracker>(myUrl, newsTracker).pipe(
      // tap( Errors ==> this.log('Save newsTracker') ),
    catchError(this.errors.handleError<NewsTracker>('save'))
  );

}


}
