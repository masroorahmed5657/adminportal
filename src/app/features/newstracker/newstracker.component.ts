import { Component, OnInit } from '@angular/core';
import { NewsTracker } from '../../shared/models/model-classes.model';
import { NewstrackerService } from '../../shared/services/newstracker.service';
import Swal from "sweetalert2";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { faDeleteLeft, faSortAlphaUp, faPrint, faUpload, faBarcode, faPlusSquare, faDashboard, faRemove, faRupeeSign, faDollar, faCar, faHome, faSave, faUndo, faFilter, faEdit, faPlusCircle, faHistory, faFileInvoiceDollar, faShoppingCart, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-newstracker',
  imports: [CommonModule,FormsModule, FontAwesomeModule],
  templateUrl: './newstracker.component.html',
  styleUrl: './newstracker.component.scss'
})
export class NewstrackerComponent implements OnInit {


  enabledEdit: any[] = [];
  newstrackerlist: NewsTracker[] = [];

  addFlag = false;
  preview = '';
  currentUser: any;

  faSave=faSave;
  faDeleteLeft=faDeleteLeft;
  faRemove=faRemove;
  faEdit=faEdit;

  activeRow: number | null = null; // highlight ke liye

  constructor(private newsService: NewstrackerService) { }

  ngOnInit(): void {
    this.newsService.getNewsTrackerList().subscribe((data: NewsTracker[]) => {
      this.newstrackerlist = data;

    });

  }

  /* ******************************************************** */
  onSave(row: any) {

    let newstracker: NewsTracker = new NewsTracker();

    if (row < 0) {
      //Add dept
      newstracker.newsId=null;
      newstracker.news = (document.getElementById('news-new') as HTMLInputElement).value;
      let bFound = false;
      //Check deptId exist in system?
      for (let i = 0; i < this.newstrackerlist.length; i++) {
        if (newstracker.news === this.newstrackerlist[i].news) {
          bFound = true;
          break;
        }

      }
      if (bFound) {
        Swal.fire('Error', 'News Ticker Already Exists', 'error');
        return;
      }

      newstracker.news = (document.getElementById('news-new') as HTMLInputElement).value;
      let site = (document.getElementById('site-new') as HTMLSelectElement);
      newstracker.site = site.options[site.selectedIndex].value;

    }
    else {
      //EDIT
      if (!this.enabledEdit[row]) {
        return;
      }
      let i = 0;
      this.addFlag = false;//for deptId
      newstracker.newsId = this.newstrackerlist[row].newsId;

      newstracker.news = (document.getElementById('news-' + row) as HTMLInputElement).value;
      let site = (document.getElementById('site-' + row) as HTMLSelectElement);
      newstracker.site = site.options[site.selectedIndex].value;
      this.enabledEdit[row] = false; //Disable Edit after save

    }//edit


    this.newsService.save(newstracker).subscribe(
      (data: NewsTracker) => {
        let ret = data;
        if (data !== null) {
          if (data === undefined) {
            Swal.fire('Error', 'Error in saving News Ticker', 'error');
          }
          else {
            if (ret.newsId !== null) {
              this.activeRow = null; // highlight remove
              Swal.fire('Submit', 'You have saved News Ticker ' + ret.newsId + ' Succesfully!', 'success');
              window.location.reload();
            }
          }
        }

      });

  }

  /* ********************************************************************* */

  onDelete(row: any) {

    Swal.fire({
      title: 'Are you sure want to delete News Ticker?',
      text: 'You can not recover News Tciker!!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((response: any) => {

      if (response.value) {

        this.newsService.delete(this.newstrackerlist[row].newsId).subscribe(() => {
          this.activeRow = null; // highlight remove
          window.location.reload();
        })

      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your Newstracker is safe',
          'error'
        )
      }
    });

  }

  /* ********************************************************** */

  startEdit(row: any) {
    this.enabledEdit = [];
    this.enabledEdit[row] = true;

    this.activeRow = row; // ye row highlight hoga
    
  }

  /* ********************************************************** */

  addNewstracker() {
    this.addFlag = true;
    /*let newsTracker: NewsTracker = new NewsTracker();//empty dept
    this.newstrackerlist.push(newsTracker);
    this.enabledEdit[this.newstrackerlist.length - 1] = true;
    */

  }

  newstrackerList(){
    this.addFlag = false;
  }

}
