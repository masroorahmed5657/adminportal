import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-landing',
    imports: [CommonModule],
    templateUrl: './landing.component.html',
    styleUrl: './landing.component.scss'
})
export class LandingComponent {
    logoName = environment.logoName;
    versionNumber = environment.versionNumber;

    features = [
        { icon: 'ri-shopping-bag-fill', title: 'Inventory Tracking', desc: 'Real-time visibility into stock levels across every product.' },
        { icon: 'ri-file-copy-2-fill', title: 'Purchase Orders', desc: 'Create, track, and receive purchase orders with ease.' },
        { icon: 'ri-line-chart-fill', title: 'Sales & Profit Reports', desc: 'Daily sales, top products, and profit/loss at a glance.' },
        { icon: 'ri-alert-fill', title: 'Expiry Alerts', desc: 'Stay ahead of expiring stock before it becomes a loss.' }
    ];

    constructor(private router: Router) { }

    goToLogin(): void {
        this.router.navigate(['/login']);
    }
}