import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';

interface Favorito {
  name: string;
  icao: string;
}

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit {
  favoritos: Favorito[] = [];
  //icao: string = '';

  constructor(private router: Router, private dataService: DataService, private auth: AuthService) {}

  ngOnInit() {
    this.favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    this.verificarUsuario();
  }

  /**
   * @function cargarFavoritos
   * @description Este método carga la lista de favoritos del localStorage y se llama en ngOnInit() y después de eliminar un favorito para asegurarse de que la vista se actualice.
   */
  cargarFavoritos() {
    this.favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  /**
   * @function eliminarFavorito
   * @description para eliminar el favorito de la lista
   * @param favoritoItem
   */
  eliminarFavorito(favorito: Favorito) {
    this.favoritos = this.favoritos.filter((fav) => fav.icao !== favorito.icao);
    localStorage.setItem('favoritos', JSON.stringify(this.favoritos));
  }

  /**
   * @function verFavorito
   * @description Vuelve a mostrar la informacion de los favoritos guardados
   */
  verFavorito(icao: string) {
    this.dataService.changeIcao(icao); // Cambia el ICAO en el servicio
    this.router.navigate(['/home']); // Luego navega a home
  }

  /**
   * @function esFavorito
   * @description Este método verifica si un ítem dado es un favorito, lo que ayuda a decidir si la estrella debe estar marcada o no.
   */
  esFavorito(icao: string): boolean {
    return this.favoritos.some((fav) => fav.icao === icao);
  }

   /**
   * @function verificarUsuario
   * @description Verifica que el usuario esté logueado
   */

  verificarUsuario() {
    this.auth.getUser().subscribe((res) => {
      if (!res) {
        this.router.navigate(['/login']);
      }
    });
  }
}
