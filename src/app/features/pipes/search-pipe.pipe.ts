import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchpipe'
})
export class SearchPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (!args) {
      return value;

    }
    console.log(value)
    return value.filter((val: any) => {
      let rVal = (val.customer.firstName.toString().includes(args)) || (val.orders.orderId.toString().includes(args) || (val.orders.orderStatus.toString().includes(args)));
      //let rVal=(val.order.customer?.firstName.toLocaleLowerCase().includes(args)) || (val.venue.toLocaleLowerCase().includes(args)) || (val.timing.toString().includes(args)) || (val.address.toLocaleLowerCase().includes(args));
      return rVal;
    })
  }
}
