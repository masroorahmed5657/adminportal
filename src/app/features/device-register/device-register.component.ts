import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { DeviceRegister } from '../../shared/models/model-classes.model';
<<<<<<< HEAD
import { NotificationService } from '../../shared/services/notification.service';
=======
>>>>>>> e99ff1c95dd1b66647fe96478b0f65a98b54e6de


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

<<<<<<< HEAD
  constructor(private notify: NotificationService) {
=======
  constructor() {
>>>>>>> e99ff1c95dd1b66647fe96478b0f65a98b54e6de

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

  saveDevice() {

    if (!this.device.device_name) {
<<<<<<< HEAD
      this.notify.warning('Device Name Required');
=======
      alert('Device Name Required');
>>>>>>> e99ff1c95dd1b66647fe96478b0f65a98b54e6de
      return;
    }

    if (this.device.device_id) {

      const index = this.devicesList.findIndex(
        x => x.device_id == this.device.device_id
      );

      if (index != -1) {

        this.devicesList[index] = {
          ...this.device
        };

<<<<<<< HEAD
        this.notify.success('Device Updated Successfully');
=======
        alert('Device Updated Successfully');
>>>>>>> e99ff1c95dd1b66647fe96478b0f65a98b54e6de
      }

    } else {

      this.device.device_id = Date.now();

      this.devicesList.unshift({
        ...this.device
      });

<<<<<<< HEAD
      this.notify.success('Device Added Successfully');
=======
      alert('Device Added Successfully');
>>>>>>> e99ff1c95dd1b66647fe96478b0f65a98b54e6de
    }

    this.resetForm();
  }

  editDevice(item: DeviceRegister) {

    this.device = {
      ...item
    };
  }

<<<<<<< HEAD
  async deleteDevice(item: DeviceRegister) {

    const confirmed = await this.notify.confirmDelete('this device');
    if (!confirmed) {
      this.notify.info('Device is safe');
      return;
    }

    this.devicesList = this.devicesList.filter(
      x => x.device_id != item.device_id
    );

    this.notify.success('Device has been deleted.');
=======
  deleteDevice(item: DeviceRegister) {

    if (confirm('Are you sure you want to delete this device?')) {

      this.devicesList = this.devicesList.filter(
        x => x.device_id != item.device_id
      );
    }
>>>>>>> e99ff1c95dd1b66647fe96478b0f65a98b54e6de
  }

  resetForm() {

    this.device = new DeviceRegister();

    this.device.active_flag = 1;
  }

  filteredDevices() {

    if (!this.searchText) {
      return this.devicesList;
    }

    return this.devicesList.filter(x =>
      x.device_name?.toLowerCase()
        .includes(this.searchText.toLowerCase())
      ||
      x.device_uuid?.toLowerCase()
        .includes(this.searchText.toLowerCase())
    );
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> e99ff1c95dd1b66647fe96478b0f65a98b54e6de
