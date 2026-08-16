import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { DeviceRegister } from '../../shared/models/model-classes.model';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-device-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule
  ],
  templateUrl: './device-register.component.html',
  styleUrl: './device-register.component.scss'
})
export class DeviceRegisterComponent implements OnInit {

  // ============================================================
  // STORAGE KEY
  // ============================================================

  private readonly STORAGE_KEY = 'device_register_list';


  // ============================================================
  // FORM MODEL
  // ============================================================

  device: DeviceRegister = new DeviceRegister();


  // ============================================================
  // DEVICE LIST
  // ============================================================

  devicesList: DeviceRegister[] = [];


  // ============================================================
  // SEARCH
  // ============================================================

  searchText: string = '';


  // ============================================================
  // FORM VISIBILITY
  // ============================================================

  showAddForm: boolean = false;


  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private notify: NotificationService
  ) {}


  // ============================================================
  // INITIALIZATION
  // ============================================================

  ngOnInit(): void {
    this.resetForm();
    this.loadDevices();
  }


  // ============================================================
  // LOAD DEVICES
  //
  // First checks localStorage.
  //
  // If devices already exist:
  //     Load them.
  //
  // If nothing exists:
  //     Load the two default/sample devices
  //     and save them to localStorage.
  // ============================================================

  loadDevices(): void {

    try {

      const savedDevices = localStorage.getItem(this.STORAGE_KEY);

      if (savedDevices) {

        const parsedDevices: DeviceRegister[] = JSON.parse(savedDevices);

        if (Array.isArray(parsedDevices)) {
          this.devicesList = parsedDevices;
          return;
        }

      }

    } catch (error) {

      console.error(
        'Error loading devices from localStorage:',
        error
      );

    }


    // No saved devices found.
    // Create initial sample devices.

    this.devicesList = [
      {
        device_id: 1,
        device_name: 'POS Counter 1',
        branch_id: 101,
        device_uuid: 'UUID-ABC-123456',
        active_flag: 1
      },
      {
        device_id: 2,
        device_name: 'Kitchen Display',
        branch_id: 102,
        device_uuid: 'UUID-XYZ-789456',
        active_flag: 0
      }
    ];


    // Save initial devices

    this.persistDevices();

  }


  // ============================================================
  // SAVE DEVICES TO LOCAL STORAGE
  // ============================================================

  private persistDevices(): void {

    try {

      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(this.devicesList)
      );

    } catch (error) {

      console.error(
        'Error saving devices to localStorage:',
        error
      );

    }

  }


  // ============================================================
  // OPEN ADD DEVICE FORM
  // ============================================================

  openAddDevice(): void {

    this.resetForm();

    this.showAddForm = true;

  }


  // ============================================================
  // SAVE / UPDATE DEVICE
  // ============================================================

  saveDevice(): void {

    // ----------------------------------------------------------
    // VALIDATION
    // ----------------------------------------------------------

    if (!this.device.device_name?.trim()) {

      this.notify.warning('Device Name Required');

      return;

    }


    // ----------------------------------------------------------
    // UPDATE EXISTING DEVICE
    // ----------------------------------------------------------

    if (this.device.device_id) {

      const index = this.devicesList.findIndex(
        x => x.device_id === this.device.device_id
      );


      if (index !== -1) {

        this.devicesList[index] = {
          ...this.device
        };


        // IMPORTANT:
        // Save updated list to localStorage

        this.persistDevices();


        this.notify.success(
          'Device Updated Successfully'
        );

      }

    }


    // ----------------------------------------------------------
    // ADD NEW DEVICE
    // ----------------------------------------------------------

    else {

      // Generate unique ID

      this.device.device_id = Date.now();


      // Add device at the beginning

      this.devicesList.unshift({
        ...this.device
      });


      // IMPORTANT:
      // Save new device permanently

      this.persistDevices();


      this.notify.success(
        'Device Added Successfully'
      );

    }


    // ----------------------------------------------------------
    // RESET FORM
    // ----------------------------------------------------------

    this.resetForm();

    this.showAddForm = false;

  }


  // ============================================================
  // EDIT DEVICE
  // ============================================================

  editDevice(item: DeviceRegister): void {

    this.device = {
      ...item
    };

    this.showAddForm = true;

  }


  // ============================================================
  // DELETE DEVICE
  // ============================================================

  async deleteDevice(item: DeviceRegister): Promise<void> {

    const confirmed = await this.notify.confirmDelete(
      'this device'
    );


    if (!confirmed) {

      this.notify.info(
        'Device is safe'
      );

      return;

    }


    // Remove device from array

    this.devicesList = this.devicesList.filter(
      x => x.device_id !== item.device_id
    );


    // IMPORTANT:
    // Save updated list after deletion

    this.persistDevices();


    this.notify.success(
      'Device has been deleted.'
    );

  }


  // ============================================================
  // RESET FORM
  // ============================================================

  resetForm(): void {

    this.device = new DeviceRegister();

    this.device.active_flag = 1;

  }


  // ============================================================
  // CANCEL FORM
  // ============================================================

  cancelForm(): void {

    this.resetForm();

    this.showAddForm = false;

  }


  // ============================================================
  // SEARCH / FILTER
  // ============================================================

  filteredDevices(): DeviceRegister[] {

    if (!this.searchText?.trim()) {

      return this.devicesList;

    }


    const search = this.searchText
      .toLowerCase()
      .trim();


    return this.devicesList.filter(
      x =>
        x.device_name
          ?.toLowerCase()
          .includes(search) ||

        x.device_uuid
          ?.toLowerCase()
          .includes(search) ||

        String(x.branch_id)
          .toLowerCase()
          .includes(search)
    );

  }

}