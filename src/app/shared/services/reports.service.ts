import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseHttpService } from "../helper/base.http.service";
import { HttpMethodService } from "../helper/http-method.service";
import { QurbaniResponse, TodayTotalearning, WeeklyTotalearning, MonthlTotalyearning, TotalCountSale, OrderSaleReportResponse, DailyProductSale, WeeklyProductSale, MonthlyProductSale, YearlyProductSale, WeeklyCategorySale, MonthlyCategorySale, YearlyCategorySale, DailysubCategorySale, WeeklysubCategorySale, MonthlysubCategorySale, YearlysubCategorySale, ReportRequest, AgentSaleReportResponse, OrderSaleReport } from "../models/model-classes.model";


@Injectable({
   providedIn: 'root'
})
export class ReportsService  {


   constructor(private http: HttpMethodService) {
     
  

   }

   /* ************************************************************* */
   getQurbaniCount(): Observable<QurbaniResponse> {

      return this.http.get<QurbaniResponse>('reports/qurbani/getTotalCount')

   }
   /* ************************************************************* */



   //todayearning  api
   /* ************************************************************* */
   getTodayTotalEarning(): Observable<TodayTotalearning[]> {

      return this.http.get<TodayTotalearning[]>('reports/gettodaytotalearning');


   }
   /* ************************************************************* */

   //getweeklyearning api
   /* ************************************************************* */
   getWeeklyTotalEarning(): Observable<WeeklyTotalearning[]> {

      return this.http.get<TodayTotalearning[]>('reports/weeklytotalearning');
   }
   /* ************************************************************* */


   //getweeklyearning api
   /* ************************************************************* */
   getMonthlyTotalEarning(): Observable<MonthlTotalyearning[]> {

      return this.http.get<MonthlTotalyearning[]>('reports/getMonthlyTotalEarning');

   }
   /* ************************************************************* */


   //getTotalCountSaleapi
   /* ************************************************************* */
   getTotalCountSale(): Observable<TotalCountSale[]> {

      return this.http.get<TotalCountSale[]>('reports/getTotalCountSale');
   }
   /* ************************************************************* */



   //getTotalOrderapi
   /* ************************************************************* */
   getTotalCountOrders(): Observable<any> {

      return this.http.get<any>('reports/getTotalNewOrders');
   }
   /* ************************************************************* */

   //getTotalCountProductsapi
   /* ************************************************************* */
   getTotalCountProducts(): Observable<any> {

      return this.http.get<any>('reports/getTotalActiveProducts');
   }
   /* ************************************************************* */



   //getTotalCountSignupsapi
   /* ************************************************************* */
   getTotalCountSignup(): Observable<any> {

      return this.http.get<any>('reports/getTotalSubscribed');
   }
   /* ************************************************************* */


   getTotalCountReviews(): Observable<any> {

      return this.http.get<any>('reports/getTotalReviews');
   }
   /* ************************************************************* */





   //Dailsy Sales  api
   /* ************************************************************* */

   getDailySale(): Observable<OrderSaleReportResponse> {
      return this.http.get<OrderSaleReportResponse>('reports/dailySaleTotal');
   }
   /* ************************************************************* */


   //Weekly Sales  api
   /* ************************************************************* */
   weeklySaleTotal(): Observable<OrderSaleReportResponse> {

      return this.http.get<OrderSaleReportResponse>('reports/weeklySaleTotal');
   }
   /* ************************************************************* */


   //Montly Sales  api
   /* ************************************************************* */
   getMonthlySale(): Observable<OrderSaleReportResponse> {

      return this.http.get<OrderSaleReportResponse>('reports/currentMonthlySale');
   }
   /* ************************************************************* */


   //Montly Sales  api
   /* ************************************************************* */
   getYearlySale(): Observable<OrderSaleReportResponse> {

      return this.http.get<OrderSaleReportResponse>('reports/yearlySaleTotal');
   }
   /* ************************************************************* */



   //Daily Product Sales  api
   /* ************************************************************* */
   getDailyProductSale(): Observable<DailyProductSale[]> {

      return this.http.get<DailyProductSale[]>('reports/dailyProductSale');
   }
   /* ************************************************************* */

   //weekly Product Sales  api
   /* ************************************************************* */
   getWeeklyProductSale(): Observable<WeeklyProductSale[]> {

      return this.http.get<WeeklyProductSale[]>('reports/weeklyProductSale');
   }
   /* ************************************************************* */


   //monthly Product Sales  api
   /* ************************************************************* */
   getMonthlyProductSale(): Observable<MonthlyProductSale[]> {

      return this.http.get<MonthlyProductSale[]>('reports/monthlyProductSale');
   }
   /* ************************************************************* */


   //Yearly Product Sales  api
   /* ************************************************************* */
   getYearlyProductSale(): Observable<YearlyProductSale[]> {

      return this.http.get<YearlyProductSale[]>('reports/yearlyProductSale');
   }
   /* ************************************************************* */





   //Category category Sales  api
   /* ************************************************************* */
   getTotalCategorySale(): Observable<OrderSaleReportResponse> {

      return this.http.get<OrderSaleReportResponse>('reports/getTotalCategorySale');
   }
   /* ************************************************************* */

   //weekly category Sales  api
   /* ************************************************************* */
   getWeeklyCategorySale(): Observable<WeeklyCategorySale[]> {

      return this.http.get<WeeklyCategorySale[]>('reports/weeklyCategorySale');
   }
   /* ************************************************************* */


   //monthly category Sales  api
   /* ************************************************************* */
   getMonthlyCategorySale(): Observable<MonthlyCategorySale[]> {

      return this.http.get<MonthlyCategorySale[]>('reports/weeklyCategorySale');
   }
   /* ************************************************************* */


   //Yearly category Sales  api
   /* ************************************************************* */
   getYearlyCategorySale(): Observable<YearlyCategorySale[]> {

      return this.http.get<YearlyCategorySale[]>('reports/yearlyCategorySale');
   }
   /* ************************************************************* */





   //daily subcategory Sales  api
   /* ************************************************************* */
   getDailysubCategorySale(): Observable<DailysubCategorySale[]> {

      return this.http.get<DailysubCategorySale[]>('reports/dailySubCategorySale');
   }
   /* ************************************************************* */

   //weekly subcategory Sales  api
   /* ************************************************************* */
   getWeeklysubCategorySale(): Observable<WeeklysubCategorySale[]> {

      return this.http.get<WeeklysubCategorySale[]>('reports/weeklysubCategorySale');
   }
   /* ************************************************************* */


   //monthly subcategory Sales  api
   /* ************************************************************* */
   getMonthlysubCategorySale(): Observable<MonthlysubCategorySale[]> {

      return this.http.get<MonthlysubCategorySale[]>('reports/monthlysubCategorySale');
   }
   /* ************************************************************* */


   //Yearly subcategory Sales  api
   /* ************************************************************* */
   getYearlysubCategorySale(): Observable<YearlysubCategorySale[]> {

      return this.http.get<YearlysubCategorySale[]>('reports/yearlysubCategorySale');
   }
   /* ************************************************************* */


   /* ************************************************************* */
   getCurrentMonthSale(): Observable<OrderSaleReportResponse> {

      return this.http.get<OrderSaleReportResponse>('reports/currentMonthlySale');
   }

   /* ************************************************************* */
   getDailySaleExcel(orderType: any): Observable<OrderSaleReportResponse> {



      return this.http.get<OrderSaleReportResponse>('reports/dailySale/+orderType');
   }
   /* ************************************************************* */
   getDailySaleExcelWithDateRange(orderType: any, reportRequest: ReportRequest): Observable<OrderSaleReportResponse> {


      return this.http.post<OrderSaleReportResponse>('reports/dailySaleWithDate', reportRequest);
   }
   /* *********************************************************** */
   /* ************************************************************* */
   dailySaleTotalCashCreditCount(): Observable<any> {

      return this.http.get<any>('reports/dailySaleTotalCashCreditCount');
   }
   /* ************************************************************* */
   getAgentSaleWithDate(reportRequest: ReportRequest): Observable<AgentSaleReportResponse> {



      return this.http.post<AgentSaleReportResponse>('reports/agentSaleWithDate', reportRequest);

   }
   /* ************************************************************* */
   getTopProductsWithDateRange(reportRequest: ReportRequest): Observable<OrderSaleReport[]> {


      return this.http.post<OrderSaleReport[]>('reports/topProductsWithDate', reportRequest);
   }

   /* ************************************************************* */
   getTopCategoryWithDateRange(reportRequest: ReportRequest): Observable<OrderSaleReport[]> {

      return this.http.post<OrderSaleReport[]>('reports/topCategorySaleWithDate', reportRequest);
   }

   /* ************************************************************* */
   getTopBrandsWithDateRange(reportRequest: ReportRequest): Observable<OrderSaleReport[]> {

      return this.http.post<OrderSaleReport[]>('reports/topBrandSaleWithDate', reportRequest);
   }






   /* ******************* END OF SERVICE *********************** */
}