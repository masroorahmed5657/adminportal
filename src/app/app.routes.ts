import { Routes } from '@angular/router';
import { LoginComponent } from './account/login/login.component';
import { AddInvoiceComponent } from './features/add-invoice/add-invoice.component';
import { AddUserComponent } from './features/add-user/add-user.component';
import { BrandsComponent } from './features/brands/brands.component';
import { CategoryComponent } from './features/category/category.component';
import { CustomerComponent } from './features/customer/customer.component';
import { ExpensesComponent } from './features/expenses/expenses.component';
import { ExpiredProductComponent } from './features/expired-product/expired-product.component';
import { ImportProductsComponent } from './features/import-products/import-products.component';
import { InventoryAdjustmentComponent } from './features/inventory-adjustment/inventory-adjustment.component';
import { InvoiceComponent } from './features/invoice/invoice.component';
import { ListInvoiceComponent } from './features/list-invoice/list-invoice.component';
import { MyMessagesComponent } from './features/my-messages/my-messages.component';
import { NewstrackerComponent } from './features/newstracker/newstracker.component';
import { NotificationsComponent } from './features/notifications/notifications.component';
import { ProductAddWithoutImageComponent } from './features/product-add-without-image/product-add-without-image.component';
import { ProductEditWithoutImageComponent } from './features/product-edit-without-image/product-edit-without-image.component';
import { ProductMasterEditComponent } from './features/product-master-edit/product-master-edit.component';
import { ProductreportsComponent } from './features/productreports/productreports.component';
import { ProductsAddComponent } from './features/products-add/products-add.component';
import { ProductsEditComponent } from './features/products-edit/products-edit.component';
import { ProductsComponent } from './features/products/products.component';
import { PurchaseInvoiceComponent } from './features/purchase-invoice/purchase-invoice.component';
import { PurchaseOrderAddComponent } from './features/purchase-order-add/purchase-order-add.component';
import { PurchaseOrderEditComponent } from './features/purchase-order-edit/purchase-order-edit.component';
import { PurchaseOrderComponent } from './features/purchase-order/purchase-order.component';
import { ReceiveProductComponent } from './features/receive-product/receive-product.component';
import { CatreportsComponent } from './features/reports/catreports/catreports.component';
import { CommissionReportComponent } from './features/reports/commission-report/commission-report.component';
import DailySaleReportComponent from './features/reports/daily-sale-report/daily-sale-report.component';
import { ReportsComponent } from './features/reports/reports.component';
import { Top10ReportsComponent } from './features/reports/top10-reports/top10-reports.component';
import { StoreHoursComponent } from './features/store-hours/store-hours.component';
import { SupplierComponent } from './features/supplier/supplier.component';
import { VendorComponent } from './features/vendor/vendor.component';
import { AuthGuard } from './guards/auth.guard';
import { LayoutComponent } from './layouts/layout/layout.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { HomeComponent } from './features/home/home.component';
import { Home2Component } from './features/home2/home2.component';
import { AdminUserComponent } from './features/adminuser/adminuser.component';
import { ProfitLossComponent } from './features/profit-loss/profit-loss.component';
import { SalesComponent } from './features/sales/sales.component';
import { SettingsComponent } from './features/settings/settings.component';
import { UserListComponent } from './features/user-list/user-list.component';
import { ProductMasterAddComponent } from './features/product-master-add/product-master-add.component';
import { ProductSimpleEditComponent } from './features/product-simple-edit/product-simple-edit.component';
import { ProductSimpleAddComponent } from './features/product-simple-add/product-simple-add.component';
import { DepartmentsComponent } from './features/departments/departments.component';
import { CashierShiftComponent } from './features/cashier-shift/cashier-shift.component';
import { DeviceRegisterComponent } from './features/device-register/device-register.component';
import { ErrorLogsComponent } from './features/error-logs/error-logs.component';

export const routes: Routes = [
       {
        path: '',
        component: LoginComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'layout',
        component: LayoutComponent, children: [
            {
                path: 'app-sidebar',
                component: SidebarComponent
            },
            {
                path: 'home',
                component: HomeComponent,
                canActivate:[AuthGuard]
            },
            {
                path: 'add-invoice',
                component: AddInvoiceComponent
            },
            {
                path: 'add-user',
                component: AddUserComponent
            },
            {
                path: 'brands',
                component: BrandsComponent
            },
            {
                path: 'category',
                component: CategoryComponent
            },
            {
                path: 'departments',
                component: DepartmentsComponent
            },

            {
                path: 'customer',
                component: CustomerComponent
            },
            {
                path: 'expenses',
                component: ExpensesComponent
            },
            {
                path: 'expired-product',
                component: ExpiredProductComponent
            },
            {
                path: 'home2',
                component: Home2Component
            },
            {
                path: 'adminuser',
                component: AdminUserComponent
            },

            {
                path: 'import-products',
                component: ImportProductsComponent
            },
            {
                path: 'inventory-adjustment',
                component: InventoryAdjustmentComponent
            },
            {
                path: 'invoice',
                component: InvoiceComponent
            },
           
            {
                path: 'list-invoice',
                component: ListInvoiceComponent
            },
            {
                path: 'my-messages',
                component: MyMessagesComponent
            },
            {
                path: 'newstracker',
                component: NewstrackerComponent
            },
            {
                path: 'notifications',
                component: NotificationsComponent
            },

            {
                path: 'product-add-without-image',
                component: ProductAddWithoutImageComponent
            },
            {
                path: 'product-edit-without-image',
                component: ProductEditWithoutImageComponent
            },
            {
                path: 'productreports',
                component: ProductreportsComponent
            },
            {
                path: 'products',
                component: ProductsComponent
            },
            {
                path: 'products-add',
                component: ProductsAddComponent
            },
             {
                path: 'products-master-add',
                component: ProductMasterAddComponent
            },
             {
                path: 'products-simple-add',
                component: ProductSimpleAddComponent
            },
            {
                path: 'products-edit/:productId',
                component: ProductsEditComponent
            },
            {
                path: 'products-master-edit/:productId',
                component: ProductMasterEditComponent
            },
            {
                path: 'products-simple-edit/:productId',
                component: ProductSimpleEditComponent
            },
            {
                path: 'profit-loss',
                component: ProfitLossComponent
            },
            {
                path: 'purchase-invoice/:receiveId',
                component: PurchaseInvoiceComponent
            },
            {
                path: 'purchase-order',
                component: PurchaseOrderComponent
            },
            {
                path: 'purchase-order-add',
                component: PurchaseOrderAddComponent
            },
            {
                path: 'purchase-order-edit/:purchaseOrderId',
                component: PurchaseOrderEditComponent
            },
            {
                path: 'receive-product',
                component: ReceiveProductComponent
            },
            {
                path: 'reports',
                component: ReportsComponent
            },
            {
                path: 'catreports',
                component: CatreportsComponent
            },
            {
                path: 'commission-report',
                component: CommissionReportComponent
            },
            {
                path: 'daily-sale-report',
                component: DailySaleReportComponent
            },
            {
                path: 'top10-reports/:name',
                component: Top10ReportsComponent
            },
            {
                path: 'settings',
                component: SettingsComponent
            },
            {
                path: 'sales',
                component: SalesComponent
            },
            {
                path: 'store-hours',
                component: StoreHoursComponent
            },
         
            {
                path: 'supplier',
                component: SupplierComponent
            },
            {
                path: 'user-list',
                component: UserListComponent
            },
            {
                path: 'vendor',
                component: VendorComponent
            },
            {
                path: 'cashier-shift',
                component: CashierShiftComponent
            },
            {
                path: 'device-register',
                component: DeviceRegisterComponent
            },
            {
                path: 'error-logs',
                component: ErrorLogsComponent
            }

        ]

    },

];

