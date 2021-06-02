import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { TabItem } from '../shared/models/tabItem.models';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  tabs :TabItem[] = [
    {
      label: 'Films',
      route: 'films'
    },
    {
      label: 'Series',
      route: 'series'
    }
  ]

  constructor(
    private _auth :AngularFireAuth
  ) {}

  ngOnInit(): void {
    
  }

  logout() {
    this._auth.signOut();
  }

}
