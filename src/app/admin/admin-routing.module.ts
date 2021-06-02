import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../auth-guard.service';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {path: 'admin', component: AdminComponent, canActivate: [AuthGuardService], 
    children: [
      { path: 'dashboard', component: HomeComponent, canActivate: [AuthGuardService]}
    ]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
