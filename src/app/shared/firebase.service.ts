import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService extends DataService {

  constructor(_db :AngularFireDatabase) {
    super("Films/Id", _db); // appeler le constructeur du parent et de l'initialiser
  }
}
