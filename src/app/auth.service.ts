import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
// import {signOut, Auth} from '@angular/fire/auth'
import firebase from 'firebase/compat/app';
import {GoogleAuthProvider} from 'firebase/auth'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

   /**
   * @function register
   * @description Método para registrar un nuevo usuario
   */
  async register(email: string, password: string) {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      return userCredential.user; // Retorna el usuario registrado
    } catch (error) {
      console.error('Error al registrarse:', error);
      throw error; // Lanza el error para manejarlo en el componente
    }
  }
  /**
   * @function login
   * @description Método para iniciar sesión
   */
  async login(email: string, password: string) {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      return userCredential.user; // Retorna el usuario autenticado
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error; // Lanza el error para manejarlo en el componente
    }
  }
  /**
   * @function logout
   * @description Método para cerrar sesión
   */
  async logout() {
    // try {
    //   await this.afAuth.signOut();
    // } catch (error) {
    //   console.error('Error al cerrar sesión:', error);
    // }
    return this.afAuth
      .signOut()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((error) => console.log(error));
  }

   /**
   * @function getUser
   * @description Método para obtener el estado de autenticación del usuario
   */
  getUser() {
    // if (this.afAuth.authState) {
    //   this.router.navigate(['/login']);
    // }
    return this.afAuth.authState; // Retorna un observable con el estado del usuario
  }

  /**
   * @function loginWithGoogle
   * @description Poder loguearse con Google
   */
  loginWithGoogle(){
    return this.afAuth.signInWithPopup(new GoogleAuthProvider()).then((res: any) => {this.router.navigate([''])});
   }
}
