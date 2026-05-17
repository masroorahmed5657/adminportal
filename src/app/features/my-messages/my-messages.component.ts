import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-messages',
  imports: [CommonModule,FormsModule],
  templateUrl: './my-messages.component.html',
  styleUrl: './my-messages.component.scss'
})
export class MyMessagesComponent {


}
