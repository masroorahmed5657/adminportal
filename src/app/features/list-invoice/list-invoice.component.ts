import { Component } from '@angular/core';
import { FooterComponent } from "../../layouts/footer/footer.component";
import { Header2Component } from "../header2/header2.component";

@Component({
  selector: 'app-list-invoice',
  imports: [FooterComponent, Header2Component],
  templateUrl: './list-invoice.component.html',
  styleUrl: './list-invoice.component.scss'
})
export class ListInvoiceComponent {

}
