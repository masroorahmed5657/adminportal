import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Review } from '../models/model-classes.model';
import { Errors } from '../errors/errors';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private myUrl = environment.apiUrl ; //http://localhost:8080/FASHION_API/
  errors: Errors = new Errors();

  constructor(private http:HttpClient) { }


saveReview(reviews: Review): Observable<Review>{

  let myUrl = `${this.myUrl}` + `review/save`  ;

  return this.http.post<Review>(myUrl, reviews).pipe(
      // tap( Errors ==> this.log('Save Stocks') ),
    catchError(this.errors.handleError<Review>('saveReview'))
);

}

/* ********************* */
getReviewsList(): Observable<Review[]>{

  let myUrl = `${this.myUrl}` + `review/findAll` ;

  return this.http.get<Review[]>(myUrl).pipe(
      //tap( error ==> this.log('Fetched Reviews') ),
    catchError(this.errors.handleError<Review[]>('getReviewsList'))
);
}

/**********************/
/* ********************* */
delete(reviewId: number): Observable<any>{

  let myUrl = `${this.myUrl}` + `review/delete/` + reviewId;

  return this.http.post<any>(myUrl, reviewId).pipe(
      //tap( error ==> this.log('delete ReviewsList') ),
    catchError(this.errors.handleError<any>('deleteReview'))
  );

}


}
