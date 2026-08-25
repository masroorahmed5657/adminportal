import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category, ProductView, ProductWrapper } from '../../../shared/models/model-classes.model';
import { CategoryService } from '../../../shared/services/category.service';
import { ProductsService } from '../../../shared/services/products.service';

@Component({
  selector: 'app-inventory-report',
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-report.component.html',
  styleUrl: './inventory-report.component.scss'
})
export class InventoryReportComponent implements OnInit {
  categoryList: Category[] = [];
  products: ProductView[] = [];

  selectedCategoryId: any = '';
  searchText = '';
  lowStockOnly = false;
  lowStockThreshold = 10;
  loading = false;
  errorMessage = '';
  hasLoadedReport = false;
  page = 1;
  pageSize = 10;

  constructor(
    private categoryService: CategoryService,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadDefaultInventory();
  }


  get filteredProducts(): ProductView[] {
    const search = this.searchText.trim().toLowerCase();

    if (!search) {
      return this.products;
    }

    return this.products.filter((product) =>
      (product.productName || '').toLowerCase().includes(search) ||
      (product.sku || '').toLowerCase().includes(search)
    );
  }

  get totalInventoryCost(): number {
    return this.filteredProducts.reduce((total, product) => total + this.inventoryCost(product), 0);
  }

  get totalInventorySaleValue(): number {
    return this.filteredProducts.reduce((total, product) => total + this.inventorySaleValue(product), 0);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredProducts.length / this.pageSize));
  }

  get pagedProducts(): ProductView[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  loadInventory(): void {
    if (this.selectedCategoryId === '' || this.selectedCategoryId === null || this.selectedCategoryId === undefined) {
      this.errorMessage = 'Select a category to load its inventory. The available inventory API requires a category.';
      this.products = [];
      this.hasLoadedReport = false;
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.hasLoadedReport = false;

    const request = this.lowStockOnly
      ? this.productsService.getLowInventoryProducts(this.selectedCategoryId, this.lowStockThreshold)
      : this.productsService.getProducts(this.selectedCategoryId);

    request.subscribe({
      next: (response: ProductWrapper) => {
        this.products = response?.productList || [];
        this.page = 1;
        this.hasLoadedReport = true;
        this.loading = false;
      },
      error: () => {
        this.products = [];
        this.loading = false;
        this.errorMessage = 'Unable to load inventory for the selected category.';
      }
    });
  }
  
  loadDefaultInventory(): void {
    this.loading = true;
    this.errorMessage = '';
    this.hasLoadedReport = false;

    this.productsService.getFirstLatestProducts(100, 0).subscribe({
      next: (products: ProductView[]) => {
        this.products = products || [];
        this.page = 1;
        this.hasLoadedReport = true;
        this.loading = false;
      },
      error: () => {
        this.products = [];
        this.loading = false;
        this.errorMessage = 'Unable to load default inventory.';
      }
    });
  }

  inventoryStatus(product: ProductView): 'Out of Stock' | 'Low Stock' | 'In Stock' {
    const quantity = this.numberValue(product.quantity);

    if (quantity <= 0 || product.instockFlag === false || product.instockFlag === 0 || product.instockFlag === 'N') {
      return 'Out of Stock';
    }

    if (quantity <= this.lowStockThreshold) {
      return 'Low Stock';
    }

    return 'In Stock';
  }

  inventoryCost(product: ProductView): number {
    return this.numberValue(product.quantity) * this.numberValue(product.purchasePrice);
  }

  inventorySaleValue(product: ProductView): number {
    return this.numberValue(product.quantity) * this.numberValue(product.salePrice);
  }

  hasPrice(value: any): boolean {
    return value !== null && value !== undefined && value !== '' && !Number.isNaN(Number(value));
  }

  resetPage(): void {
    this.page = 1;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
    }
  }

  private loadCategories(): void {
    this.categoryService.getCategoryList().subscribe({
      next: (categories: Category[]) => this.categoryList = categories || [],
      error: () => this.errorMessage = 'Unable to load categories for the inventory filter.'
    });
  }

  private numberValue(value: any): number {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  }
}
