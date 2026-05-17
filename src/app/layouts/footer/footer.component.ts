import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {

  versionNumber = environment.versionNumber ;
  projectName = environment.appName ;
  year=2025;

  constructor() { }


  ngOnInit(): void {
  }

}