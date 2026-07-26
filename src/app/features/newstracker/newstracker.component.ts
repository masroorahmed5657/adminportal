import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';

import { NewsTracker } from '../../shared/models/model-classes.model';
import { NewstrackerService } from '../../shared/services/newstracker.service';

@Component({
  selector: 'app-newstracker',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './newstracker.component.html',
  styleUrls: ['./newstracker.component.scss']
})
export class NewstrackerComponent implements OnInit {
  // Data
  newstrackerlist: NewsTracker[] = [];

  // UI flags
  addFlag = false;
  enabledEdit: boolean[] = [];
  activeRow: number | null = null;

  // Search & pagination
  searchText = '';
  p = 1;

  // Add form fields
  newNewsText = '';
  newSite = 'Mobile App';

  constructor(private newsService: NewstrackerService) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.newsService.getNewsTrackerList().subscribe({
      next: (data) => {
        this.newstrackerlist = data;
        // reset edit flags
        this.enabledEdit = new Array(data.length).fill(false);
      },
      error: () => Swal.fire('Error', 'Failed to load news', 'error')
    });
  }

  // Filtered list for search
  get filteredNewsList(): NewsTracker[] {
    if (!this.searchText.trim()) return this.newstrackerlist;
    const term = this.searchText.toLowerCase();
    return this.newstrackerlist.filter(item =>
      item.news?.toLowerCase().includes(term) ||
      item.site?.toLowerCase().includes(term)
    );
  }

  // Enable edit mode for a specific row
  startEdit(row: number): void {
    // Reset all edit flags
    this.enabledEdit.fill(false);
    this.enabledEdit[row] = true;
    this.activeRow = row;
  }

  // Save (add or edit)
  onSave(row: number): void {
    const newsItem: NewsTracker = new NewsTracker();

    if (row < 0) {
      // ADD mode
      if (!this.newNewsText.trim()) {
        Swal.fire('Validation', 'News text is required', 'warning');
        return;
      }
      // Check for duplicate news text
      const exists = this.newstrackerlist.some(
        item => item.news?.toLowerCase() === this.newNewsText.toLowerCase()
      );
      if (exists) {
        Swal.fire('Error', 'News Ticker already exists', 'error');
        return;
      }
      newsItem.newsId = null;
      newsItem.news = this.newNewsText;
      newsItem.site = this.newSite;
    } else {
      // EDIT mode
      if (!this.enabledEdit[row]) {
        return; // not in edit mode
      }
      newsItem.newsId = this.newstrackerlist[row].newsId;
      newsItem.news = this.newstrackerlist[row].news;
      newsItem.site = this.newstrackerlist[row].site;
      this.enabledEdit[row] = false; // disable after save
    }

    this.newsService.save(newsItem).subscribe({
      next: (saved) => {
        if (saved && saved.newsId) {
          Swal.fire('Success', `News Ticker ${saved.newsId} saved successfully`, 'success');
          this.activeRow = null;
          this.loadNews();       // refresh the list
          if (row < 0) {
            // clear add form and hide it
            this.addFlag = false;
            this.newNewsText = '';
            this.newSite = 'Mobile App';
          }
        } else {
          Swal.fire('Error', 'Failed to save news ticker', 'error');
        }
      },
      error: () => Swal.fire('Error', 'Error saving news ticker', 'error')
    });
  }

  // Delete
  onDelete(row: number): void {
    const id = this.newstrackerlist[row].newsId;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this news ticker!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.newsService.delete(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'News ticker has been deleted.', 'success');
            this.activeRow = null;
            this.loadNews();
          },
          error: () => Swal.fire('Error', 'Delete failed', 'error')
        });
      }
    });
  }

  // Show add form
  addNewstracker(): void {
    this.addFlag = true;
    this.newNewsText = '';
    this.newSite = 'Mobile App';
  }

  // Return to list view
  newstrackerList(): void {
    this.addFlag = false;
  }
}