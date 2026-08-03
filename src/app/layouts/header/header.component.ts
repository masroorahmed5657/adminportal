import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';
import { ThemeService } from '../../shared/services/theme.service';
import { CommonModule } from '@angular/common';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  showMenuFlag: boolean = true;
  isSidebarCollapsed = false;
  faSignOut = faSignOut;

  currentPageTitle: string = 'TechMaci'; // Default title

  // Map routes to display titles
  pageTitles: { [key: string]: string } = {
    '/layout/home': 'Home',
    '/layout/brands': 'Brands',
    '/layout/category': 'Category',
    '/layout/purchase-order': 'Purchase Order (PO)',
    '/layout/receive-product': 'Receiving PO',
    '/layout/invoice': 'Invoicing PO',
    '/layout/supplier': 'Supplier',
    '/layout/inventory-adjustment': 'Inventory',
    '/layout/sales': 'Sales List',
    '/layout/departments': 'Department',
    '/layout/store-hours': 'Store Hours',
    '/layout/employees': 'Employees',
    '/layout/customer': 'Customers',
    '/layout/barcode': 'BarCodes',
    '/layout/my-messages': 'My Messages',
    '/layout/notifications': 'Notifications',
    '/layout/newstracker': 'News Tracker',
    '/layout/settings': 'Settings',
    '/layout/orders': 'Orders',
    '/layout/orderdetail': 'Order Detail',
    '/layout/orders-payment': 'Payment',
    '/layout/products-add': 'Products Add',
    '/layout/products': 'Products',
    '/layout/expired-product': 'Expired Products',
    '/layout/adminuser': 'Admin User',
    '/layout/top10-reports/top10Product': 'Top Product Sale Report',
    '/layout/top10-reports/top10Category': 'Top Category Sale Report',
    '/layout/top10-reports/top10Brands': 'Top Brands Sale Report',
    '/layout/commission-report': 'Commission',
    '/layout/daily-sale-report': 'Daily Sale',
    '/layout/expenses': 'Expenses',
    '/layout/salaries': 'Salaries',
    '/layout/vendor': 'Vendor',
    '/layout/profit-loss': 'Profit & Loss',
    '/layout/purchase-order-add': 'PO Add',
    '/layout/purchase-order-edit/:purchaseOrderId': 'PO Edit',
    '/layout/ezpz-tax': 'Ezpz Tax',
    '/layout/salary': 'Salary',

    // ===== Previously missing routes (from app.routes.ts) =====
    '/layout/device-register': 'Device Register',
    '/layout/warehouse': 'Warehouse',
    '/layout/error-logs': 'Error Logs',
    '/layout/expense-category': 'Expense Category',
    '/layout/payment': 'Payment',
    '/layout/order-number': 'Order Number',
    '/layout/departmentmanager': 'Department Manager',
    '/layout/departmentemployee': 'Department Employee',
    '/layout/add-invoice': 'Add Invoice',
    '/layout/add-user': 'Add User',
    '/layout/import-products': 'Import Products',
    '/layout/list-invoice': 'List Invoice',
    '/layout/catreports': 'Category Reports',
    '/layout/reports': 'Reports',
    '/layout/user-list': 'User List',
    '/layout/products-master-add': 'Products Master Add',
    '/layout/products-simple-add': 'Products Simple Add',
    '/layout/product-add-without-image': 'Product Add',
    '/layout/product-edit-without-image': 'Product Edit',
    '/layout/productreports': 'Product Reports',
    '/layout/products-edit/:productId': 'Products Edit',
    '/layout/products-master-edit/:productId': 'Products Master Edit',
    '/layout/products-simple-edit/:productId': 'Products Simple Edit',
    '/layout/purchase-invoice/:receiveId': 'Purchase Invoice',
    '/layout/stock-report': 'Stock Report',
    '/layout/inventory-report': 'Inventory Report',
    '/layout/home2': 'Home',

  };

  constructor(private router: Router,) { }

  theme: string = 'light';
  headerColor: string = '#FF6713';

  ngOnInit(): void {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updatePageTitle(
          (event as NavigationEnd).urlAfterRedirects || event.url
        );
      });

    this.updatePageTitle(this.router.url);
  }

  showHideMenuBar() {
    const sidebar = document.getElementById('sidebar');
    const header = document.getElementById('header');
    const main = document.getElementById('main');

    if (window.innerWidth <= 768) {

      // Mobile: open/close sidebar
      sidebar?.classList.toggle('show-sidebar');

    } else {

      // Desktop: collapse/expand sidebar
      this.isSidebarCollapsed = !this.isSidebarCollapsed;

      sidebar?.classList.toggle('collapsed', this.isSidebarCollapsed);
      header?.classList.toggle('sidebar-collapsed', this.isSidebarCollapsed);
      main?.classList.toggle('sidebar-collapsed', this.isSidebarCollapsed);

    }
  }

  updatePageTitle(url: string): void {
    // Strip any query string before matching
    const cleanUrl = url.split('?')[0];

    // 1. Try an exact match first (covers all static routes)
    if (this.pageTitles[cleanUrl]) {
      this.currentPageTitle = this.pageTitles[cleanUrl];
      return;
    }

    // 2. Fall back to matching routes that contain a dynamic ":param"
    //    segment — e.g. '/layout/products-edit/:productId' should match
    //    an actual URL like '/layout/products-edit/42'.
    const matchedKey = Object.keys(this.pageTitles).find(route => {
      if (!route.includes('/:')) return false;
      const routeBase = route.split('/:')[0];
      return cleanUrl.startsWith(routeBase + '/');
    });

    this.currentPageTitle = matchedKey ? this.pageTitles[matchedKey] : 'TechMaci';
  }

  /* ************************************************************** */
  signOut() {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');

    sessionStorage.clear();

    this.router.navigate(['login']);
  }


}