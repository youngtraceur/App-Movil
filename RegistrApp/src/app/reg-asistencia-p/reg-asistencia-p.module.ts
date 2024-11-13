import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegAsistenciaPPageRoutingModule } from './reg-asistencia-p-routing.module';

import { RegAsistenciaPPage } from './reg-asistencia-p.page';
import { QRCodeModule } from 'angularx-qrcode';
@NgModule({
  imports: [QRCodeModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RegAsistenciaPPageRoutingModule
  ],
  declarations: [RegAsistenciaPPage]
})
export class RegAsistenciaPPageModule {}
