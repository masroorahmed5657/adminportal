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
    '/layout/cashier-shift': 'Cashier Shift',
    '/layout/device-register': 'Device Register',
    '/layout/error-logs': 'Error Logs',

    


  };

  constructor(private router: Router, ) { }

  theme: string = 'light';
  headerColor: string = '#FF6713';

  ngOnInit(): void {


    // Watch for route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updatePageTitle((event as NavigationEnd).urlAfterRedirects || (event as NavigationEnd).url);
      });


      this.showHideMenuBar();
    // Initialize with current route
      this.updatePageTitle(this.router.url);
  }

  showHideMenuBar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;

    const sidebar = document.getElementById('sidebar');
    const header = document.getElementById('header');
    const main = document.getElementById('main'); // 🔥 yeh add kiya


    // toggle class on sidebar
    sidebar?.classList.toggle('collapsed', this.isSidebarCollapsed);

    // toggle class on header
    header?.classList.toggle('sidebar-collapsed', this.isSidebarCollapsed);

    //toggle class on main page
    //main-content.sidebar-collapsed
    main?.classList.toggle('sidebar-collapsed', this.isSidebarCollapsed);
  }

  updatePageTitle(url: string): void {
    //const matchingRoute = Object.keys(this.pageTitles).find(route => url.startsWith(route));
    //this.currentPageTitle = matchingRoute ? this.pageTitles[matchingRoute] : 'TechMaci';

    this.currentPageTitle = url ? this.pageTitles[url] : 'TechMaci';

    let i=0;
  }

  /* ************************************************************** */
  signOut() {
    //this.cache.set('currentUser', null);
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');

    sessionStorage.clear();

    //this.cache.resetAllData();

    //this.isLoggedIn = false;
    // if (this.isLoggedIn) {
    //   //this.loginService.logOutUser();
    //   //this.serverLogout();
    // }
    this.router.navigate(['login']);
  }


}
