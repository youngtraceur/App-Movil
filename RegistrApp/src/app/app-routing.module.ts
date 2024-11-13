import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { noIngresadoGuard } from './no-ingresado.guard';
import { ingresadoGuard } from './ingresado.guard';
import { MenuPage } from './menu/menu.page';
import { IngresarPage } from './ingresar/ingresar.page';
const routes: Routes = [
  { path: '', redirectTo: 'ingresar', pathMatch: 'full' },
  { path: 'login', component: IngresarPage },
  { path: 'menu', component: MenuPage, canActivate: [ingresadoGuard] },
  {
    path: '',
    redirectTo: 'ingresar',
    pathMatch: 'full'
  },
  {
    path: 'ingresar',
    loadChildren: () => import('./ingresar/ingresar.module').then( m => m.IngresarPageModule)
    
  },
  {
    path: 'cambiar-clave',
    loadChildren: () => import('./cambiar-clave/cambiar-clave.module').then( m => m.CambiarClavePageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule),
    canActivate:[ingresadoGuard]
  },
  {
    path: 'asignaturas',
    loadChildren: () => import('./asignaturas/asignaturas.module').then( m => m.AsignaturasPageModule),
    canActivate:[ingresadoGuard]
  },
  {
    path: 'asistencia',
    loadChildren: () => import('./asistencia/asistencia.module').then( m => m.AsistenciaPageModule),
    canActivate:[ingresadoGuard]
  },
  {
    path: 'reg-asistencia',
    loadChildren: () => import('./reg-asistencia/reg-asistencia.module').then( m => m.RegAsistenciaPageModule),
    canActivate:[ingresadoGuard]
  },
  {
    path: 'notas',
    loadChildren: () => import('./notas/notas.module').then( m => m.NotasPageModule),
    canActivate:[noIngresadoGuard]
  },
  {
    path: 'reg-asistencia-p',
    loadChildren: () => import('./reg-asistencia-p/reg-asistencia-p.module').then( m => m.RegAsistenciaPPageModule),
    canActivate:[ingresadoGuard]
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
