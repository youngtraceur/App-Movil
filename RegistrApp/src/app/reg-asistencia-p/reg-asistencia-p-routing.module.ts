import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegAsistenciaPPage } from './reg-asistencia-p.page';

const routes: Routes = [
  {
    path: '',
    component: RegAsistenciaPPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegAsistenciaPPageRoutingModule {}
