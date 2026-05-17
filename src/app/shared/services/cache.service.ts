import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  completeUserInfo: any;
  token: string | undefined;
  currentTime: any;
  timeFormat: any;
  sessionTimeout = 0;

  constructor() {
    this.sessionTimeout = environment.sessionTimeout;
   }


  /** returns String containing everything in storage that is received from server **/
  public getLoggedInUserData() {
    const loggedInUser = localStorage.getItem('cpcUserInfo');
    if (typeof (loggedInUser) !== 'undefined' && loggedInUser !== null
      && this.getAuthenticationInfo() !== null && this.getAuthenticationInfo() !== '') {
      return JSON.parse(loggedInUser);
    }
    return null;
  }


  /** returns String Authentication string from storage **/
  public getAuthenticationInfo() {
    const loggedInUser = localStorage.getItem('cpcUserInfo');
    if (typeof (loggedInUser) !== 'undefined' && loggedInUser !== null && loggedInUser !== '') {
      return JSON.parse(loggedInUser).CPCUserInfo.authenticationInfo;
    }
    return null;
  }


  /** returns current active token **/
  getToken() {
    this.updateActiveTime();
    if (typeof (this.getLoggedInUserData()) !== 'undefined' && this.getLoggedInUserData() !== null) {

      if (typeof (this.getLoggedInUserData().token) !== 'undefined' && this.getLoggedInUserData().token !== '') {
        // console.log('getToen:: ' + this.getLoggedInUserData().token);
        return this.getLoggedInUserData().token;
      } else {
        if (typeof (this.getAuthenticationInfo()) !== 'undefined' && this.getAuthenticationInfo() !== null) {
          return this.getAuthenticationInfo().token;
        }
      }
    }
    return null;

  }
  /* ********************************* */
  updateActiveTime() {
    const existingUserInfo = this.getLoggedInUserData();
    if (typeof(existingUserInfo) !== 'undefined' && existingUserInfo !== null) {
        existingUserInfo.lastactivetime = this.getCurrentTime();
       localStorage.setItem('cpcUserInfo', JSON.stringify(existingUserInfo));
    }
  }

  /* ********************************* */
  getCurrentTime(): any {
    this.currentTime = new Date().getTime();
    return this.currentTime;
  }

  /* ********************************* */
  getUserLastActiveTime(): any {
    const existingUserInfo = this.getLoggedInUserData();
    if (typeof(existingUserInfo) !== 'undefined' && existingUserInfo != null) {
    const lastactiveTime = existingUserInfo.lastactivetime;
        return new Date(+lastactiveTime).getTime();
    }

    return 0;
  }

  /* ********************************* */
  isSessionValid() {
    console.log('getCurrentTime: ' + this.getCurrentTime());
    console.log('getLastActiveTime : ' + this.getUserLastActiveTime() + ' Max-inactive-time-config:: ' + this.sessionTimeout + ' minutes');
    console.log('time diff: ' + ((this.getCurrentTime() - this.getUserLastActiveTime()) / 1000));
    if (this.sessionTimeout ===  0 ) {
      this.sessionTimeout = 30;
    }

    if (this.sessionTimeout <= -1) {
      // Session never expires
      return true;
    }

    return true;
  }

  resetAllData() {
    //Reset all data
    // localStorage.clear();
    sessionStorage.clear()
  }

  
  /* ********************************* */

  set(key: string, value: any) {
    localStorage.setItem(key, value);
  }

  get(key: string) : any{
    return localStorage.getItem(key);
  }

  /* ********************************* */
  setList(key: string, values: any) {
    localStorage.setItem(key, JSON.stringify(values));
  }
  
  getList(key: string){
   let data = localStorage.getItem(key);
    
    if (typeof (data) !== 'undefined' && data !== null && data !== '') {
      return JSON.parse(data);
    }
    return null;
  }
  /* ********************************* */

}
