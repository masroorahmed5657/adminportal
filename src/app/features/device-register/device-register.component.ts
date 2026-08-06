import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { DeviceRegister } from '../../shared/models/model-classes.model';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-device-register',
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './device-register.component.html',
  styleUrl: './device-register.component.scss'
})
export class DeviceRegisterComponent {

  device: DeviceRegister = new DeviceRegister();

  devicesList: DeviceRegister[] = [];

  searchText: string = '';

  // Controls Add Device form visibility
  showAddForm = false;

  constructor(private notify: NotificationService) {
    this.resetForm();
    this.loadSampleData();
  }

  loadSampleData() {

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

  }

  openAddDevice() {
    this.resetForm();
    this.showAddForm = true;
  }

  saveDevice() {

    if (!this.device.device_name) {
      this.notify.warning('Device Name Required');
      return;
    }

    if (this.device.device_id) {

      const index = this.devicesList.findIndex(
        x => x.device_id === this.device.device_id
      );

      if (index !== -1) {

        this.devicesList[index] = {
          ...this.device
        };

        this.notify.success('Device Updated Successfully');
      }

    } else {

      this.device.device_id = Date.now();

      this.devicesList.unshift({
        ...this.device
      });

      this.notify.success('Device Added Successfully');
    }

    this.resetForm();
    this.showAddForm = false;

  }

  editDevice(item: DeviceRegister) {

    this.device = {
      ...item
    };

    this.showAddForm = true;

  }

  async deleteDevice(item: DeviceRegister) {

    const confirmed = await this.notify.confirmDelete('this device');

    if (!confirmed) {
      this.notify.info('Device is safe');
      return;
    }

    this.devicesList = this.devicesList.filter(
      x => x.device_id !== item.device_id
    );

    this.notify.success('Device has been deleted.');

  }

  resetForm() {

    this.device = new DeviceRegister();
    this.device.active_flag = 1;

  }

  cancelForm() {

    this.resetForm();
    this.showAddForm = false;

  }

  filteredDevices() {

    if (!this.searchText) {
      return this.devicesList;
    }

    return this.devicesList.filter(x =>
      x.device_name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      x.device_uuid?.toLowerCase().includes(this.searchText.toLowerCase())
    );

  }

}