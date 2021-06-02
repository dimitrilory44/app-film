import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { FilmsComponent } from './films/films.component';
import { SeriesComponent } from './series/series.component';
import { AdminRoutingModule } from '../admin/admin-routing.module';
import { AppMaterialModule } from '../app-material.module';

@NgModule({
  declarations: [
    HomeComponent,
    FilmsComponent,
    SeriesComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AppMaterialModule
  ]
})
export class AdminModule { }
