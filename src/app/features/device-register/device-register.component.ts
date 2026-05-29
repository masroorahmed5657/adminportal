import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { DeviceRegister } from '../../shared/models/model-classes.model';


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

  constructor() {

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
      alert('Device Name Required');
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

        alert('Device Updated Successfully');
      }

    } else {

      this.device.device_id = Date.now();

      this.devicesList.unshift({
        ...this.device
      });

      alert('Device Added Successfully');
    }

    this.resetForm();
  }

  editDevice(item: DeviceRegister) {

    this.device = {
      ...item
    };
  }

  deleteDevice(item: DeviceRegister) {

    if (confirm('Are you sure you want to delete this device?')) {

      this.devicesList = this.devicesList.filter(
        x => x.device_id != item.device_id
      );
    }
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
}
