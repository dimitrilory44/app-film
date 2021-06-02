import { Component, OnChanges, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/shared/firebase.service';
import { filmItem } from 'src/app/shared/models/film.models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../sass/pages/_home.scss']
})
export class HomeComponent implements OnInit, OnChanges {

  films! :filmItem [];
  breakpoint!: number;

  constructor(private _db :FirebaseService) {}

  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 900) ? 3 : 9;

    this._db.getAll().subscribe((reponse) => {
      this.films = reponse;
    });
  }
  
  ngOnChanges() {
    this.breakpoint = (window.innerWidth <= 400) ? 2 : 9;

  }

  onResize(event :any) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 9 : 2;
  }

}
