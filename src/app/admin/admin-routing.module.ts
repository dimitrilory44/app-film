import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../_helpers/auth-guard.service';
import { HomeComponent } from './home/home.component';
import { FilmsComponent } from './films/films.component';
import { SeriesComponent } from './series/series.component';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: '', 
    component: AdminComponent, 
    canActivate: [AuthGuardService], 
    children: [
      {
        path: 'dashboard', 
        component: HomeComponent, 
        canActivate: [AuthGuardService]
      },
      {
        path: 'films', 
        component: FilmsComponent, 
        canActivate: [AuthGuardService]
      },
      {
        path: 'series', 
        component: SeriesComponent, 
        canActivate: [AuthGuardService]
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'admin/dashboard'
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
