import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxPaginationModule } from 'ngx-pagination';

import { NewsTracker } from '../../shared/models/model-classes.model';
import { NewstrackerService } from '../../shared/services/newstracker.service';
import { NotificationService } from '../../shared/services/notification.service';

import {
  faSave,
  faEdit,
  faRemove,
  faPlusCircle,
  faSearch,
  faList
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-newstracker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    NgxPaginationModule
  ],
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

  // Search & Pagination
  searchText = '';
  p = 1;

  // Add Form
  newNewsText = '';
  newSite = 'Mobile App';

  // Icons
  faSave = faSave;
  faEdit = faEdit;
  faRemove = faRemove;
  faPlusCircle = faPlusCircle;
  faSearch = faSearch;
  faList = faList;

  constructor(
    private newsService: NewstrackerService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.newsService.getNewsTrackerList().subscribe({
      next: (data) => {
        this.newstrackerlist = data;
        this.enabledEdit = new Array(data.length).fill(false);
      },
      error: () => {
        this.notify.error('Failed to load news');
      }
    });
  }

  // Search Filter
  get filteredNewsList(): NewsTracker[] {

    if (!this.searchText.trim()) {
      return this.newstrackerlist;
    }

    const term = this.searchText.toLowerCase();

    return this.newstrackerlist.filter(item =>
      item.news?.toLowerCase().includes(term) ||
      item.site?.toLowerCase().includes(term)
    );
  }

  // Enable Edit
  startEdit(row: number): void {

    this.enabledEdit.fill(false);

    this.enabledEdit[row] = true;

    this.activeRow = row;
  }

  // Save (Add / Update)
  onSave(row: number): void {

    const newsItem = new NewsTracker();

    if (row < 0) {

      if (!this.newNewsText.trim()) {
        this.notify.warning('News text is required');
        return;
      }

      const exists = this.newstrackerlist.some(
        item => item.news?.toLowerCase() === this.newNewsText.toLowerCase()
      );

      if (exists) {
        this.notify.error('News Ticker already exists');
        return;
      }

      newsItem.newsId = null;
      newsItem.news = this.newNewsText;
      newsItem.site = this.newSite;

    } else {

      if (!this.enabledEdit[row]) {
        return;
      }

      newsItem.newsId = this.newstrackerlist[row].newsId;
      newsItem.news = this.newstrackerlist[row].news;
      newsItem.site = this.newstrackerlist[row].site;

      this.enabledEdit[row] = false;
    }

    this.newsService.save(newsItem).subscribe({
      next: (saved) => {

        if (saved && saved.newsId) {

          this.notify.success(
            `News Ticker ${saved.newsId} saved successfully`
          );

          this.activeRow = null;

          this.loadNews();

          if (row < 0) {

            this.addFlag = false;
            this.newNewsText = '';
            this.newSite = 'Mobile App';
          }

        } else {

          this.notify.error('Failed to save news ticker');
        }
      },

      error: () => {

        this.notify.error('Error saving news ticker');
      }
    });
  }

  // Delete
  async onDelete(row: number): Promise<void> {

    const confirmed = await this.notify.confirmDelete('this news ticker');

    if (!confirmed) {
      this.notify.info('News ticker is safe');
      return;
    }

    const id = this.newstrackerlist[row].newsId;

    this.newsService.delete(id).subscribe({

      next: () => {

        this.notify.success('News ticker has been deleted.');

        this.activeRow = null;

        this.loadNews();
      },

      error: () => {

        this.notify.error('Delete failed');
      }
    });
  }

  // Show Add Form
  addNewstracker(): void {

    this.addFlag = true;
    this.newNewsText = '';
    this.newSite = 'Mobile App';
  }

  // Return to List
  newstrackerList(): void {

    this.addFlag = false;
  }
}