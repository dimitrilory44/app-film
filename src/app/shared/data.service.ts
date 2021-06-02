import { Inject, Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  data = this._db.list("/" + this._url);

  constructor(
    @Inject(String) private _url :string, 
    private _db : AngularFireDatabase
  ) { }

  getAll<T>(){
    return this.data.snapshotChanges().pipe( 
      map( function( reponse ){ 
        return reponse.map( function( item : any ){ 
          return { 
            ...item.payload.val()
          }
         })
      })
    )
  }
}
