// import { Injectable } from '@angular/core';
// import { environment } from '../../../environments/environment';

// @Injectable()
// export abstract class BaseHttpService {
//   constructor(public endpoint: string) {}

//   protected resolveUrl(path: string): string {
//     const baseUrl = environment.apiUrl.replace(/\/$/, '');
    
//     if (path.startsWith('files/')) {
//       return `${baseUrl}/${path}`;
//     }

//     const cleanEndpoint = this.endpoint.replace(/^\/|\/$/g, '');
//     return `${baseUrl}/${cleanEndpoint}/${path}`;
//   }
// }




// import { Injectable } from '@angular/core';
// import { environment } from '../../../environments/environment';

// @Injectable()
// export abstract class BaseHttpService {
//    constructor(public endpoint: any) {
//  }


//   protected resolveUrl(path: string): string {
//     return `${environment.apiUrl}${this.endpoint}/${path}`;
//   }
// }



import { environment } from '../../../environments/environment';

export abstract class BaseHttpService {
  constructor(public endpoint: string) {}

  protected resolveUrl(path: string): string {
    const baseUrl = environment.apiUrl.replace(/\/$/, '');
    const cleanEndpoint = this.endpoint?.replace(/^\/|\/$/g, '');
    const cleanPath = path?.replace(/^\/+/, '');

    if (cleanPath.startsWith('files/')) {
      return `${baseUrl}/${cleanPath}`;
    }

    // return `${baseUrl}/${cleanEndpoint}/${cleanPath}`;
    return `${baseUrl}${cleanEndpoint}/${cleanPath}`;
  }
}
