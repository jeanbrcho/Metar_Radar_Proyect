import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  email!: string;
  password!: string;
  confirmPassword!: string; // Nueva propiedad para la confirmación de contraseña
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  /**
 * @function showLoading
 * @description Cartel de aviso de creacion exitosa de usuario 
 */
  async showLoading() {
    const loading = await this.loadingController.create({
      message: 'Usuario creado exitosamente!',
      duration: 3000,
    });
    await loading.present();
  }
  /**
 * @function showToast
 * @description alerta error
 */
  async showToast(message: string, color: 'danger' | 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
    });
    toast.present();
  }

  /**
 * @function register
 * @description Registro de usuario y validacion de contraseñas
 */
  async register() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.'; // Validación de coincidencia
      this.successMessage = '';
      return;
    }
    try {
      const user = await this.authService.register(this.email, this.password);
      console.log('Usuario registrado:', user?.email);
      this.showLoading();
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3000);

    } catch (error) {
      console.error('Error al registrarse:', error);
      this.showToast('Ingrese un mail válido', 'danger');
    }
  }
}
