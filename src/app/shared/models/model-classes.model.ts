
export class UserLoginResponse {
   adminUser?: AdminUser;
   authenticated?: boolean;
   authMessage?: string;
   token?: string;
   newCustomer?: boolean;
   customer?: Customer;
   adminUserRolesList: AdminUserRoles[] = [];
}

export class AdminUser {
   userId?: any;
   loginId?: any;
   loginPassword?: any;
   firstName?: string;
   lastName?: string;
   email?: string;
   userRole?: string;
   updatedDate: any;
   updatedBy: any;
}

export class LoginRequest {
   username: any;
   password: any;
   newPassword: any
}

export class AdminUserRoles {
   userId: any;
   module: any;
   roles: any;
}

export class CodeDropDown {
   id: any;
   text: any
}
export class ProductWrapper {
   productMap: Map<number, any> = new Map<number, any>();
   imageMap?: Map<number, any>;
   productList: any;
   totalProductCount: any;
}
export class POItems {
   poItemId: any;
   poId: any;
   productId: any;
   quantity: any;
   unitPrice: any;
   discount: any;
   tax: any;
   taxAmount: any;
   total: any;
   grandTotal: any;
   updatedBy: any;
   updatedDate: any;
}


export class POItemsView {
   poItemId: any;
   poId: any;
   productId: any;
   productName:any;
   quantity: any;
   unitPrice: any;
   discount: any;
   tax: any;
   taxAmount: any;
   total: any;
   grandTotal: any;
   updatedBy: any;
   updatedDate: any;
   upc:any;
}

export class POResponse {
   po: PurchaseOrder = new PurchaseOrder();
   poItems: POItems[] = [];
}

export class POListResponse {
   poList: PurchaseOrder[] = [];
   
}

export class PORequest {
   po: PurchaseOrder = new PurchaseOrder();
   poItems: POItems[] = [];
   purchaseQtyAdjFlag:any;

}

export class ReceiveProductRequest{
   receiveProduct:ReceiveProduct=new ReceiveProduct();
   rcvProductItems:ReceiveProductItems[]=[];
}


export class POSearch {
   poNumber: any;
   supplierId: any;
   poStatus: any;
   poStartDate: any;
   poEndDate: any;
   poType: any;
   poId: any;
}


export class ProductImage {
   imageId?: number;
   productId?: number;
   firstImage: any;
   finalImage: any;
   fileName?: string;
   filePath?: string;
   sortOrder?: number;
   displayFlag?: string;
   fileType?: string;
   imageType: any;
}



export class ProductView {
   productId?: number;
   custId?: number;
   productName?: string;
   productDetails?: string;
   unitPrice: any;
   categoryId?: number;
   category?: any;
   subCategory?: any;
   packagingAttributes: any;
   cuttingAttributes: any;
   extraAttributes: any;
   optionsAttributes: any;
   discount?: number;
   popularFlag?: number;
   productStatus?: string;
   updatedBy?: any;
   updatedDate?: any;
   productImage: any;
   firstImage: any;
   imageMimeType: any;
   madein: any;
   sku: any;
   upc: any;
   purchasePrice: any;
   wholesalePrice: any;
   salePrice: any;
   quantity: any;
   physicalDimension: any;
   weight: any;
   instockFlag: any;
   brandId: any;
   brandCode: any;
   unitName: any;
   sellinPcs: any;
   abbrName: any;
   qtyCase: any;
   expiryDate: any;
   taxExemptFlag: any;
   foodCouponFlag: any;
   couponEligibleFlag: any
   warehouseId: any;
   wFloor: any;
   wAisle: any;
   wRow: any;
   wBin: any;
   fromWarehouseId: any;
   shipmentMode: any;
   intransitFlag: any;
   showFlag: any;
   tax: any;
   hsn: any;

}

export class Customer {
   custId?: number;//	   cust_id  int(11) NOT NULL,
   custName?: string;	   //cust_name  varchar(100) NOT NULL,
   firstName?: string;
   lastName?: string;
   businessFlag?: boolean;
   email?: string;
   custType?: string;	 //  cust_type  varchar(20) NOT NULL,
   phone1?: string;
   phone2?: string;
   custPic: any; //	   cust_pic  blob  NULL;
   profession?: string;
   priority?: number;
   joiningDate: any;	  // joining_Date  datetime  NULL,
   bestWay?: string;   //best_way  varchar(50) NULL,
   bestTime: any; //	   best_time  time NULL,
   sendSmsFlag?: boolean; //	   send_sms_flag  tinyint(1)  NULL,
   sendEmailFlag?: boolean; //	   send_email_flag  tinyint(1) NULL,
   loginId?: string;
   loginPassword?: string;
   updatedBy?: string;	   //upDated_by  varchar(30)  NULL,
   updatedDate: any; //	   upDated_Date  datetime  NULL
   address: any;
   city: any;
   country: any;
   postalCode: any;
   stateProvince: any;
   salesRep: any;
   billingAddress: any;
   billingStateProvince: any;
   billingCity: any;
   billingCountry: any;
   billingPostalCode: any;
   subsExpiry: any;
   subsPlan: any;
   createdDate: any;
   createdBy: any;
   discountPercentage?: number;
  discountAmount?: number;

}
export class CustomerType {
   custType?: string;
   description?: string;
}

export class Address {
   addressId?: number;
   custId?: number;
   addressOne?: string;
   addressTwo?: string;
   city?: string;
   stateProvince?: string;
   country?: string;
   postalCode?: string;
   latitude?: number;
   longitude?: number;
   primaryFlag?: boolean;
}

export class CodeMaster {
   code?: string;
   description?: string;
}

export class Country {
   countryId?: string;
   countryCode?: string;
   name?: string;
}

export class CountryStateProvince {
   cpsId?: number;
   stateProvince?: string;
   city?: string;
   countryCode?: string;
   countryName?: string;
}

export class MessageQ {
   msgId?: number;
   message?: string;
   duration?: any;
   durationView?: string;
}

export class ResponseFile {
   id: any;
   name?: string;
   url?: string;
   type?: string;
   size?: number;
   finalImage: any;
   firstImage: any
}


export class Category {
   categoryId?: number;
   category?: string;
   subCategory?: string;
   updatedBy: any;
   updatedDate: any;
   activeFlag: any;
   finalImage: any;
   imageType: any;
   popularFlag:any;
}




///////////////////////////////////////////////////////////////////////////
export class Orders {
   orderId?: number;
   orderNum: any;
   custId?: number;
   orderType?: any;
   createDate?: any;
   orderDetail?: any;
   category?: any;
   orderStatus?: any;
   reasonForReturn?: any;
   shippingDetail?: any;
   trackingNo?: any;
   productId?: number;
   price?: any;
   updatedBy?: any;
   updatedDate?: any;
   expiryDays?: any;
   representative: any;
   address: any;
   apartment: any;
   city: any;
   stateProvince: any;
   country: any;
   postalCode: any;
   deliveryDate: any;
   notes: any;
   pickupType: any;
   paymentStatus?: any;
   grandTotal: any;
   shippingHandling: any;
   tax: any;

}

export class OrdersItems {
   orderId?: any; //   order_id  int(11) NOT NULL,
   orderItemId?: number; //   order_item_id  int(11) NOT NULL,
   productId?: number; //   product_id  int(11)  NULL,
   unitPrice: any; //   unit_price  double  NULL,
   quantity?: number;
   weight?: number;
   liter?: number;
   measuringUnit?: string;
   discount: any;
   itemStatus?: string;
   updatedBy: any;
}

export class OrdersItemsView {
   orderId?: number; //   order_id  int(11) NOT NULL,
   orderItemId?: number; //   order_item_id  int(11) NOT NULL,
   productId: any; //   product_id  int(11)  NULL,
   productName: any;
   unitPrice: any; //   unit_price  double  NULL,
   quantity?: number;
   weight?: number;
   liter?: number;
   measuringUnit?: string;
   discount: any;
   itemStatus?: string;
   updatedBy: any;
   categoryName: any;
   showItem: any;
   attributes: any;
   notes: any;
   pickupType: any;
   imageMimeType: any;
   productImage: any;
   sku: any;
}

export interface Cart {
   name: string,
   unitPrice: number,
   category: string,
   color: string,
   image: string,
   description: string,
   id: number | undefined,
   quantity: undefined | number,
   productId: number,
   userId: number
}


export class StripeCardResponse {
   cardInfo: any;
   payment: Payment = new Payment();
   statusCode: any;
   statusDesc: string = '';

}


export class Product {
   productId?: number;
   custId?: number;
   productName?: string;
   productDetails?: string;
   unitPrice?: number;
   categoryId?: number;
   packagingAttributes: any;
   cuttingAttributes: any;
   extraAttributes: any;
   optionsAttributes: any;
   discount?: number;
   popularFlag?: number;
   productStatus?: string;
   wholesalePrice: any;
   salePrice: any;
   purchasePrice: any;
   weight: any;
   physicalDimension: any;
   quantity: any;
   madein: any;
   instockFlag: any;
   imageMimeType: any;
   imageFilename: any;
   imageCharset: any;
   productImage: any;
   updatedBy?: any;
   updatedDate?: any;
   sku: any;
   upc: any;
   brandId: any;
   unitName: any;
   sellinPcs: any;
   abbrName: any;
   qtyCase: any;
   expiryDate: any;
   taxExemptFlag: any;
   foodCouponFlag: any;
   couponEligibleFlag: any;
   tax: any;
   hsn: any;
}


export class OrdersWrapper {
   orders: any;
   orderMap: any; // = new HashMap<Integer, OrderProductWrapper>();//Key = orderId, Value=Order+Product+Category

}

export class OrdersCustItemProdCatWrapper {
   orderId: any;
   orders?: Orders;
   customer?: Customer;
   /* items */

   items?: OrdersItemsView[] = [];

}

export class OrdersCustomerWrapper {

   orders?: Orders;
   customer?: Customer;
   payment?: Payment

}
export class OrderItemProductWrapper {
   ordersItems?: OrdersItems;
   category?: Category;
   products?: Product;
   agent?: AdminUser;
}
export class ApiResponse {
   statusCode?: number;
   statusDesc?: string;
}

export class OrderResponse extends ApiResponse {
   orderCustomer: OrdersCustomerWrapper[] = [];
   orderPayment: OrdersCustomerWrapper[] = [];
   orderItems: OrderItemProductWrapper[] = [];
}

export class OrderSaveResponse extends ApiResponse {
   orders?: Orders;
   orderItems: OrdersItems[] = [];
}

export class ProductSearch {
   custId: any;
   categoryId: any;
   popularFlag: any;
   status: any;
   inStockFlag: any;
   productId: number[] = [];

}
export class OrderSearch {

   status: any;
   custId: any;
   createdDateStart: any;
   createdDateEnd: any;
   categoryId: any;
   productId: any;
   orderType: any;
   orderNumber: any;

}

export class Departments {
   deptId: any;
   deptName: any;
   activeFlag: any;
   printerName: any;
   updatedDate: any;
   updatedBy: any;
   finalImage: any;
   imageType: any;
}

export class Employees {
   empId: any;
   firstName: any;
   lastName: any;
   email: any;
   phone: any;
   birthDate: any;
   gender: any;
   hireDate: any;
   // title: any;
   // deptId: any;
   updatedBy: any;
   updatedDate: any;
}
export class DepartmentEmployee {
   deptId: any;
   empId: any;
   fromDate: any;
   toDate: any;
}
export class DepartmentManager {
   deptId: any;
   empId: any;
   fromDate: any;
   toDate: any;
}

export class Salaries {
   empId: any;
   salary: any;
   fromDate: any;
   toDate: any;

}
export class Salary{
    salaryId :any;
    empId :any;
    basicSalary :any;
    allowances :any;
    bonuses :any;
    deductions :any;
    taxes :any;
    netSalary :any;
    salaryMonth :any;
    paymentMode :any;
    paymentDate :any;
    status :any;
    createdAt :any;
    updatedAt :any;
}

export class SalaryView{
    salaryId :any;
    empId :any;
    empName:any;
    basicSalary :any;
    allowances :any;
    bonuses :any;
    deductions :any;
    taxes :any;
    netSalary :any;
    salaryMonth :any;
    paymentMode :any;
    paymentDate :any;
    status :any;
    createdAt :any;
    updatedAt :any;
}



export class Titles {
   empId: any;
   title: any;
   fromDate: any;
   toDate: any;
}

export class Brands {
   brandId: any;
   brandCode: any;
   brandName: any;
}
/* ***************************** POS ******************** */
export class Invoice {
   invoiceId: any;
   custId: any;
   paymentType: any;
   totalAmount: any;
   amountTendered: any;
   bankAccountName: any;
   bankaccountNumber: any;
   dateRecorded: any;
   userId: any;
}

export class InvoiceOnly {
   invoiceId: any;
   invoiceNumber: any;
   supplierId: any;
   clientId: any;
   contactPerson: any;
   invoiceStatus: any;
   currency: any;
   invoiceDate: any;
   remarks: any;
   subTotal: any;
   discount: any;
   tax: any;
   total: any;
   validity: any;
   note: any;
   createdDate: any;
   updatedBy: any;
   updatedDate: any;

}

export class InvoiceOnlyItems {
   invoiceItemId: any;
   invoiceId: any;
   productId: any;
   quantity: any;
   unitPrice: any;
   discount: any;
   tax: any;
   total: any;
   updatedBy: any;
   updatedDate: any;
}

export class Supplier {
   supplierId: any;
   supplierCode: any;
   supplierName: any;
   supplierContact: any;
   supplierAddress: any;
   supplierEmail: any;
   
}

export class PurchaseOrder {
   purchaseOrderId: any;
   productId: any;
   quantity: any;
   unitPrice: any;
   subTotal: any;
   supplierId: any;
   orderDate: any;
   userId: any;
   poNumber: any;

   poStatus: any;
   currency: any;
   poDate: any;
   poType: any;
   remarks: any;
   discount: any;
   tax: any;
   total: any;
   updatedBy: any;
   updatedDate: any;
   poId: any;
   contactPerson: any;
   totalQty: any = 0;
   poRef:any;
   

}
export class ReceiveProduct {
   receiveProductId: any;
   poId: any;
   rcvNumber: any;
   supplierId: any;
   contactPerson: any;
   rcvStatus: any;
   currency: any;
   rcvDate: any;
   rcvType: any;
   remarks: any;
   subTotal: any;
   discount: any;
   tax: any;
   total: any;
   updatedBy: any;
   updatedDate: any;
   productId: any;
   userId: any;
   quantity: any;
   unitPrice: any;

}

export class ReceiveProductResponse {
   rcvdProduct?: ReceiveProduct;
   rcvProductItems: ReceiveProductItems[] = [];
}


export class RcvRequest {
   rcvdProduct: any;
   rcvProductItems: any;

}


export class mynewdata {
   poId: any;
   poNumber: any;
   supplierId: any;
   poStatus: any;
   poType: any;
   poDate: any;
   contactPerson: any;
   remarks: any;
   total: any;
   currency: any;
   discount: any;
   subTotal: any;
}

export class ReceiveProductItems {
   receiveItemId: any;
   receiveProductId: any;
   productId: any;
   quantity: any;
   unitPrice: any;
   discount: any;
   tax: any;
   total: any;
   warehouseId: any;
   warehouseBin: any;
   location: any;
   updatedBy: any;
   updatedDate: any;
   wholesalePrice: any;
}

export class ReceiveProductSearch {
   poId: any;
   rcvNumber: any;
   supplierId: any;
   rcvStatus: any;
   rcvStartDate: any;
   rcvFromDate: any;
   rcvType: any;

}

export class Sales {
   salesId: any;
   invoiceId: any;
   productId: any;
   quantity: any;
   unitPrice: any;
   subTotal: any;

}


export class Payment {
   paymentId: any;
   orderId: any;
   totalAmount: any;
   advanceAmount: any;
   taxesAmount: any;
   paymentStatus: any;
   paymentMethod: any;
   discount: any;
   discountReasoning: any;
   discountType: any;
   upDatedBy: any;
   updatedDate: any;
   currency: any;
}

export class PaymentRequest {
   token: any;
   amount: any;
   payment: Payment = new Payment;
   description: any;
}


export class CheckOutCreditCardPayment {
   name: any;
   currency: any;
   amount: any;
   quantity: any;
   cancelUrl: any;
   successUrl: any;
}
export class PaymentCustomerWrapper {
   Payment?: Payment;
   customer?: Customer;
}

export class CategoryQty {
   categoryId: any;
   categoryName: any;
   productId: any;
   productName: any;
   quantity: any;
   shareQty: any;
   price: any;
}

export class QurbaniResponse {
   categoryQtyList: CategoryQty[] = [];
}

export class Qurbani {
   totalGoat: any;
   totalSheep: any;
   totalCowShare: any;
   totalCow: any;
}

export class QurbaniCount {
   name: any;
   count: any;
}

export class NewsTracker {
   newsId: any;
   news: any;
   site: any;

}

export class StoreHours {
   sortOrder: any
   days: any;
   storeOpen: any;
   storeClose: any;
   openAmpm:any;
   closeAmpm:any;
}
export class AlertMessage {
   message: any;
}

export class ProductDocuments {
   docId: any;
   productId: any;
   doc1: any;
   finalImage: any;
   fileName: any;
   filePath: any;
   sortOrder: any;
   displayFlag: any;
   fileType: any;

}

export class Subscription {
   subId: any;
   subEmail: any;
   updatDate: any;
   updatedBy: any;

}

// export class Review{
//   reviewId: any;
//   revName: any;
//   activeFlag: any;
//   reviewTitle: any;
//   reviewMsg: any;
//   reviewDate: any;
//   updatedBy: any;
//   custId:any;
//   productId:any;
//   rating:any;

// }

export class Review {
   reviewId: any;
   custId: any;
   productId: any;
   rating: any;
   reviewTitle: any;
   reviewMsg: any;
   reviewDate: any;
   updatedBy: any;
}



export class TodayTotalearning {
   id: any;
   name: any;
   total: any;

}

export class WeeklyTotalearning {
   id: any;
   name: any;
   total: any;

}

export class MonthlTotalyearning {
   id: any;
   name: any;
   total: any;

}


export class TotalCountSale {
   id: any;
   name: any;
   total: any;

}

export class TotalCountOrders {

   id: any;
   name: any;
   total: any;

}

export class TotalCountProducts {
   id: any;
   name: any;
   total: any;

}

export class TotalCountSignup {
   id: any;
   name: any;
   total: any;
}

export class DailySale {
   id: any;
   date: any;
   noOrder: any;
   totalRevenue: any;
   averageOrder: any;
   categoryName: any;

}

export class CategorySalePrice {
   categoryName: any;
   salePrice: any;
   noOrder: any;
}

export class WeeklySale {

   id: any;
   date: any;
   noOrder: any;
   totalRevenue: any;
   averageOrder: any;


}

export class MonthlySale {

   id: any;
   date: any;
   noOrder: any;
   totalRevenue: any;
   averageOrder: any;


}


export class YearlySale {
   id: any;
   date: any;
   noOrder: any;
   totalRevenue: any;
   averageOrder: any;



}


export class DailyProductSale {
   id: any;
   date: any;
   productName: any;
   saleQty: any;
   price: any;
}


export class WeeklyProductSale {
   id: any;
   date: any;
   productName: any;
   saleQty: any;
   price: any;
}

export class MonthlyProductSale {
   id: any;
   date: any;
   productName: any;
   saleQty: any;
   price: any;
}

export class YearlyProductSale {
   id: any;
   date: any;
   productName: any;
   saleQty: any;
   price: any;
}

export class DailyCategorySale {
   id: any;
   date: any;
   categoryName: any;
   saleQty: any;
   subcategoryName: any;
   price: any;
}

export class WeeklyCategorySale {
   id: any;
   date: any;
   categoryName: any;
   saleQty: any;
   subcategoryName: any;
   price: any;
}

export class MonthlyCategorySale {
   id: any;
   date: any;
   categoryName: any;
   saleQty: any;
   subcategoryName: any;
   price: any;
}

export class YearlyCategorySale {
   id: any;
   date: any;
   categoryName: any;
   saleQty: any;
   subcategoryName: any;
   price: any;
}

export class DailysubCategorySale {
   id: any;
   date: any;
   subcategoryName: any;
   saleQty: any;
   productName: any;
   price: any;



}

export class WeeklysubCategorySale {
   id: any;
   date: any;
   subcategoryName: any;
   saleQty: any;
   productName: any;
   price: any;


}
export class MonthlysubCategorySale {
   id: any;
   date: any;
   subcategoryName: any;
   saleQty: any;
   productName: any;
   price: any;


}
export class YearlysubCategorySale {
   id: any;
   date: any;
   subcategoryName: any;
   saleQty: any;
   productName: any;
   price: any;



}


export class OrdersPayment {
   OrderId: any;
   PaymentStatus: any;
   CustomerCode: any;
   CustomerName: any;
   CustomerContact: any;
   CustomerEmail: any;

}


export class StateProvince {
   stateId: any;
   countryId: any;
   countryCode: any;
   stateCode: any;
   description: any;

}
export class City {
   cityId: any;
   stateId: any;
   countryId: any;
   countryCode: any;
   city: any;
}

export interface PriceSummary {
   price: number,
   discount: number,
   tax: number,
   delivery: number,
   total: number,
   grandTotal: number
}


export class EzpzTax {
   taxId: any;
   name: any;
   tax: any;
   taxType: any
   stateCode: any;

}

export class OrderSaleDailyReport {
   orderId:any;
   orderNum:any;
   paymentMethod:any;
   orderAmount:any;
   tax:any;
   grandTotal:any;
   discount:any;
   advanceAmount:any;
   dateStr:any;
   phone1:any;
   invoiceNumber:any;
   paymentStatus:any;
 }
 
export class OrderSaleReport {
   orderType: any;
   totalSale: any;
   totalCount: any;
   dateStr: any;
   dayStr: any;
   totalTax: any;
   year: any;
   month: any;
   categoryId: any;
   category: any;
   subCategory: any;
   invoiceNumber:any;
   productId:any;
   productName:any;
   brandId:any;
   brandName:any;
}

export class OrderSaleReportResponse{
   orderSaleReport: OrderSaleReport[]=[];
   orderSaleDailyReport: OrderSaleDailyReport[]=[];
   orderSaleDailyReturnReport: OrderSaleDailyReport[]=[];
   totalCashSaleCount:any;
   totalCashTax:any;
   totalCashSaleAmount:any;
 
   totalCreditSaleCount:any;
   totalCreditTax:any;
   totalCreditSaleAmount:any;
 }
 
// export class Expenses {
//    expenseId: any;
//    recordDate: any;
//    account: any;
//    currency: any;
//    cost: any;
//    financeCategoryId: any;
//    description: any;

// }

export class ExpensesResponse extends ApiResponse {
   expenses: Expenses[] = [];
}

export class ExpensesRequest {
   startRecordDate: any;
   endRecordDate: any;
   financeCategoryId: any;
   cost: any;
   account: any;

}


export class FinanceCategory {
   financeCategoryId: any;
   financeCategory: any;
   subCategory:any;
   activeFlag: any;
   updatedBy:any;
   updatedDate:any;
}


export class CustomerRequest {
   custId?: number;//	   cust_id  int(11) NOT NULL,
   custName?: string;	   //cust_name  varchar(100) NOT NULL,
   firstName?: string;
   lastName?: string;
   businessFlag?: boolean;
   email?: string;
   custType?: string;	 //  cust_type  varchar(20) NOT NULL,
   phone1?: string;
   phone2?: string;
   custPic: any; //	   cust_pic  blob  NULL;
   profession?: string;
   priority?: number;
   joiningDate: any;	  // joining_Date  datetime  NULL,
   bestWay?: string;   //best_way  varchar(50) NULL,
   bestTime: any; //	   best_time  time NULL,
   sendSmsFlag?: boolean; //	   send_sms_flag  tinyint(1)  NULL,
   sendEmailFlag?: boolean; //	   send_email_flag  tinyint(1) NULL,
   loginId?: string;
   loginPassword?: string;
   updatedBy?: string;	   //upDated_by  varchar(30)  NULL,
   updatedDate: any; //	   upDated_Date  datetime  NULL
   address: any;
   city: any;
   stateProvince: any;
   country: any;
   postalCode: any;
   createdDate: any;
   createdBy: any;
   subsExpiry: any;
   subsPlan: any;
   salesRep: any;
   billingAddress: any;
   billingCity: any;
   billingStateProvince: any;
   billingCountry: any;
   billingPostalCode: any;
}


export class CustomerResponse {
   customer: any;
   statusCode: any;
   statusDesc: any;


}

export class CustomerCountryWrapper {
   country?: Country;
   customer?: Customer;
   province?: StateProvince;
}

export class Warehouse {
   warehouseId: any;
   warehouseNbr: any;
   warehouseName: any;
   warehouseDescription: any;
   subLocation: any;
   address: any;
   city: any;
   stateProvince: any;
   country: any;
   postalCode: any;
   activeFlag: any;
   updatedBy: any;
   updatedDate: any;
   fromWarehouseId: any;
   showDetails: any;

}

export class WarehouseProducts {
   warehouseId: any;
   productId: any;
   wFloor: any;
   wAisle: any;
   wRow: any;
   wBin: any;
   fromWarehouseId: any;
   quantity: any;
   intransitFlag: any;
   shipmentMode: any;
   updatedBy: any;
   updatedDate: any;

}
export class BarcodeResponse extends ApiResponse {
   image: any;
   qrcode: any;
   imageType: any;
}

export class OrderCustomerPayment {
   orderId: any; //   order_id  int(11) NOT NULL,
   custId: any; //   cust_id  int(11) NOT NULL,
   orderType: any;   //order_type  varchar(30)  NULL,
   createDate: any; //	   create_Date  datetime  NULL,
   orderDetail: any; //   order_detail  varchar(200)  NULL,
   orderStatus: any; //order_status  varchar(20)  NULL,
   price: any; //  double  NULL,
   representative: any;
   address: any;
   apartment: any;
   city: any;
   stateProvince: any;
   country: any;
   postalCode: any;
   orderNum: any;
   orderAmount: any;
   tax: any;
   shippingHandling: any;
   grandTotal: any;
   //PAYMENT
   paymentId: any; //payment_id  int(11) NOT NULL,
   totalAmount: any;  //double  NULL,
   advanceAmount: any;  //double  NULL,
   taxesAmount: any;  //double  NULL,
   paymentStatus: any;
   paymentMethod: any;
   discount: any;
   discountReasoning: any;
   discountType: any;

   //CUSTOMER
   custName: any;	   //cust_name  varchar(100) NOT NULL,
   firstName: any;
   lastName: any;
   businessFlag: any;
   email: any;
   custType: any;	 //  cust_type  varchar(20) NOT NULL,
   phone1: any;
   phone2: any;
}

export class OrderPaymentResponse extends ApiResponse {
   orderList: OrderCustomerPayment[] = [];
}

export class CombinedModel {
   supplier?: Supplier;
   invoice?: Invoice;
   purchaseOrder?: PurchaseOrder;
}

export class CartHold {
   transactionId: any;

   subTotal: any;
   shipping: any;
   taxes: any;
   dicsount: any;
   total: any;
   price: any;

   product: ProductView[] = [];
   customer: Customer = new Customer();
   cartData: any;

}


export class InvoiceOnlySaveResponse extends ApiResponse {
   orders?: InvoiceOnly;
   orderItems: InvoiceOnlyItems[] = [];
}


export class ReportRequest {
   reportType: any;
   reportValue: any;
   startDate: any;
   endDate: any;
   startTime: any;
   endTime: any;
   topNumber:any;


}
export class DbUpdate {
   tableName: any;
   updateDate: any;
}


export class PaymentMethodResponse {
   paymentCountMap: any;
   paymentAmountMap: any;
   paymentTaxesMap: any

}
export class PaymentMethodReport {
   cashCount: any;
   cardCount: any;
   cashAmount: any;
   cardAmount: any;
   cashTax: any;
   cardTax: any;

}



export class AgentSaleReport {
   userId: any;
   loginId: any;
   firstName: any;
   lastName: any;
   userRole: any;
   totalSale: any;
   totalCount: any;
   dateStr: any;
   totalCommission: any;
   commissionPercentage: any;
   tax: any;
   totalReturn: any;
   returnTax:any;
}

export class AgentSaleReportResponse extends ApiResponse {
   saleReportList: AgentSaleReport[] = []
}

export class PoItems{
   poItemId:any;
   poId:any;
   productId:any;
   quantity:any;
   unitPrice:any;
   discount:any;
   tax:any;
   total:any;
   updatedBy:any;
   updatedDate:any;
   grandTotal:any;
   taxAmount:any;
}

export class URLRequest{
   url:any;
   encodedUrl:any;
   byteUrl: any;
}

export class MenuOrder{
   agentName: any;
   quantity:any;
   itemName:any;
   itemId:any;
   attributes:any;
   notes:any;

}

export class OrdersMenuView{
   agentName: any;
   customerName: any;
   orderNumber: any;
   orderId:any;
   tableId:any;
   time:any;
   createdDate?:Date;
   pickupDinein:any;
   orderStatus:any;
   menuList:MenuOrder[]=[];
}

export class OrderMenuResponse{
   orderMenuList:OrdersMenuView[]=[];
}

export class Expenses{
   expenseId:any;
   financeCategoryId :any;
   amount:any;
   description:any;
   transactionType:any;
   transactionDate:any;
   transactionTime:any;
   createdAt:any;
   updatedAt:any;
}

export class ExpensesView{
   expenseId:any;
   financeCategoryId:any;
   categoryName:any;
   amount:any;
   description:any;
   transactionType:any;
   transactionDate:any;
   transactionTime:any;
   createdAt:any;
   updatedAt:any;
}

export class Categories{
   categoryId:any;
   name:any;
   type:any;
   isActive:any;
   createdAt:any;
}


export class ReceiveProductItemsView{
   receiveItemId: any;
   receiveProductId: any;
   productId: any;
   productName: any;
   upc:any;
   quantity: any;
   unitPrice: any;
   discount: any;
   tax: any;
   total: any;
   warehouseId: any;
   warehouseBin: any;
   location: any;
   updatedBy: any;
   updatedDate: any;
   wholesalePrice: any;
   amount:any;

}
export class CashierShift {
  shiftId: any;
  userId: any;
  deviceId: any;
  openingBalance: any;
  closingBalance: any;
  openedAt: any;
  closedAt: any;
  shiftStatus: any;
}

export class DeviceRegister {
  device_id: any;
  device_name: any;
  branch_id: any;
  device_uuid: any;
  active_flag: any;
}

export class ErrorLogs {

  error_id: any;
  class_name: any;
  method_name: any;
  log_time: any;
  error_msg: any;
  stack_msg: any;

}

