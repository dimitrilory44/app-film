import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './_helpers/auth-guard.service';

const routes: Routes = [
  {
    path: '', 
    component: LoginComponent,
  },
  {
    path: 'admin', 
    loadChildren: () => import('../app/admin/admin.module').then(m => m.AdminModule), canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
