import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MyErrorStateMatcher } from './errorStateMatcher';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../sass/pages/_login.scss']
})
export class LoginComponent implements OnInit {

  form! :FormGroup;
  hide = true;
  error = '';

  constructor(
    private _formBuilder :FormBuilder,
    private _auth :AngularFireAuth,
    private _router :Router
  ) { }

  ngOnInit() {
    this.form = this._formBuilder.group({
      email : ['', Validators.required],
      password : ['', Validators.required]
    });
  }

  matcher = new MyErrorStateMatcher();

  login() {
    if(this.form.invalid) {
      return;
    }

    const email = this.form.controls['email'].value;
    const password = this.form.controls['password'].value;

    console.log(email, password);

    this._auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        this._router.navigate(['/home']);
        let user = userCredential.user;
      })
      .catch((error) => {
        this.error = error.message;
    });
  
  }
}
