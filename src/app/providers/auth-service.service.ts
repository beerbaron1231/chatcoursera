import { Injectable, NgZone } from '@angular/core';
import { User } from '../interface/mensaje.interface';
import { auth, database } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Mensaje } from '../interface/mensaje.interface';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { TouchSequence } from 'selenium-webdriver';
import { ThrowStmt } from '@angular/compiler';
import * as CryptoJS from 'crypto-js';
import { EncrDecrServiceService } from './encr-decr-service.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: any; // Save logged in user data
  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  private itemsCollection2: AngularFirestoreCollection;
  public chats: Mensaje[] = [];
  private database: any = [];

  private encryptText = '123456$#@$^@1ERF';

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private EncrDecr: EncrDecrServiceService
  ) {
    this.chats = [];
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;

        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })

  }
  loadMessage(userdata) {
    this.chats = [];
    this.itemsCollection = this.afs.collection<Mensaje>('items', ref => ref
      .where('to', '==', this.EncrDecr.set(this.encryptText, userdata.email)).orderBy('date', 'asc'));


    return this.itemsCollection.valueChanges().pipe(
      map((mensajes: Mensaje[]) => {

        mensajes.forEach(element => {
          element.from = this.EncrDecr.get(this.encryptText, element.from);
          element.to = this.EncrDecr.get(this.encryptText, element.to);
          element.message = this.EncrDecr.get(this.encryptText, element.message);
        });
        return this.chats = mensajes;
      })
    )


  }
  getdatabase() {
    this.itemsCollection = this.afs.collection('items');

    return this.itemsCollection.valueChanges().pipe(
      map((mensajes) => {
        return mensajes;
      })
    )
  }
  getdatabase2() {
    this.itemsCollection = this.afs.collection('users');

    return this.itemsCollection.valueChanges().pipe(
      map((mensajes) => {
        return mensajes;
      })
    )
  }
  // Sign in with email/password
  SignIn(email, password) {
    this.chats = [];
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
        this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  // Sign up with email/password
  SignUp(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        this.SendVerificationMail();
        this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification()
      .then(() => {
        this.router.navigate(['verify-email-address']);
      })
  }

  ForgotPassword(passwordResetEmail) {
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      }).catch((error) => {
        window.alert(error)
      })
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    this.chats = [];
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }



  AuthLogin(provider) {
    this.chats = [];
    return this.afAuth.auth.signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        })
        this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error)
      })
  }


  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })
  }
  // Sign out 
  SignOut() {
    this.chats = [];
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    })
  }
  addMessage(texto: string, para: string) {

    // TODO falta el UID del usuario
    const mensaje: Mensaje = {
      from: this.EncrDecr.set(this.encryptText, this.userData.email.trim()),
      message: this.EncrDecr.set(this.encryptText, texto),
      date: new Date().getTime(),
      to: this.EncrDecr.set(this.encryptText, para)
    };

    return this.itemsCollection.add(mensaje);

  }

}
