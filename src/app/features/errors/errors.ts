import { Observable, of } from "rxjs";
import { AppLoggerService } from "../../shared/services/app-logger.service";
import Swal from "sweetalert2";



export class Errors {

    appLogService: AppLoggerService = new AppLoggerService();

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     *
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    public handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead
            Swal.fire('Error', 'Server not found-' + error.message, 'error');


            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    /** Log a HeroService message with the MessageService */
    public log(message: string) {
        this.appLogService.add(`Service: ${message}`);
    }



}
