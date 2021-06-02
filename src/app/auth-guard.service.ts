import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private _auth :AngularFireAuth,
    private _router :Router
  ) {}

  canActivate() :Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(
      (resolve, reject) => {
        this._auth.onAuthStateChanged(
          (user) => {
            if(user) {
              resolve(true);
            } else {
              this._router.navigate([''])
              resolve(false);
            }
          }
        )
      }
    ) 
  }
}
