import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { AdminUser, AdminUserRoles, NewsTracker } from '../../shared/models/model-classes.model';
import { faBook, faCog, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../../environments/environment.prod';
import { CacheService } from '../../shared/services/cache.service';
import { NewstrackerService } from '../../shared/services/newstracker.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../shared/services/theme.service';
import Swal from "sweetalert2";


@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  isSidebarCollapsed = false;
  title = 'menuresp';
  /*=============== DARK LIGHT THEME ===============*/
  themeButton: any;
  darkTheme = 'dark-theme';
  iconTheme = 'ri-sun-fill';
  activeMenu: string = 'inventory'
  versionNumber = environment.versionNumber;
  showExpenseFlag=environment.showExpenseFlag;

  selectedTheme: any;
  selectedIcon: any;
  sidebarLink: any;
  classList: any
  constructor(private cache: CacheService,
    private newsService: NewstrackerService,
    private themeService: ThemeService,
    private router: Router) { }



  currentUser: AdminUser = new AdminUser();
  userLoginResponse: any;
  public isLoggedIn = false;
  faSignOut = faSignOut;
  faBook = faBook;
  faCog = faCog;
  logoName = environment.logoName;

  adminUserRolesList: AdminUserRoles[] = [];

  tickerNewsList: NewsTracker[] = [];

  showTicker = environment.showTicker;

  isDarkTheme: boolean = false;

  themeShowHide() {
    this.themeService.toggleTheme();
    this.isDarkTheme = !this.isDarkTheme

  }

  // We obtain the current theme that the interface has by validating the dark-theme class
  getCurrentTheme(): any {
    return document.body.classList.contains(this.darkTheme) ? 'dark' : 'light';
  }
  getCurrentIcon() {
    return this.themeButton.classList.contains(this.iconTheme) ? 'ri-moon-clear-fill' : 'ri-sun-fill';
  }
  filterSidebarItems(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    const allLinks = document.querySelectorAll('.admin-sidebar__link');

    allLinks.forEach(link => {
      const text = link.textContent?.toLowerCase().trim() || '';
      if (text.startsWith(query)) {
        (link as HTMLElement).style.display = 'flex';
      } else {
        (link as HTMLElement).style.display = 'none';
      }
    });
  }


  sidebarColor = '#002866';

  /*=============== SHOW SIDEBAR ===============*/
  showSidebar(toggleId: any, sidebarId: any, headerId: any, mainId: any) {
    const toggle = document.getElementById(toggleId),
      sidebar = document.getElementById(sidebarId),
      header = document.getElementById(headerId),
      main = document.getElementById(mainId)

    if (toggle && sidebar && header && main) {
      toggle.addEventListener('click', () => {
        /* Show sidebar */
        sidebar.classList.toggle('show-sidebar')
        /* Add padding header */
        header.classList.toggle('left-pd')
        /* Add padding main */
        main.classList.toggle('left-pd')
      })
    }
  }
  /* ********************************************************* */

  linkColor(): any {
    // this.sidebarLink.forEach(()=> this.classList.remove('active-link'));
    //this.classList.add('active-link');
  }


  signOut() {

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#465FFF",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {

        sessionStorage.clear(); // normal session data clear

        // optional: agar remember-me bhi logout pe clear karna ho
        localStorage.removeItem('rememberedLoginId');
        localStorage.removeItem('rememberedPassword');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('Token');

        this.isLoggedIn = false;
        this.router.navigate(['login']);

      }
    });
  }

  // Ye function header ke button click pe call hoga
  // toggleSidebar() {
  //   this.isSidebarCollapsed = !this.isSidebarCollapsed;
  // }

  /* ******************** END *************************** */
}
