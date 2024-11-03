import { Component, OnInit } from '@angular/core';

//api
import { WeatherApiService } from '../service/weather-api.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

//gps
import { Geolocation } from '@capacitor/geolocation';
//ver pais y provincia
import axios from 'axios';

//Interfaces para tipado de datos
interface Country {
  code: string;
  name: string;
}

interface Coordinates {
  decimal: number;
  degrees: string;
}

interface Aerop {
  station: {
    name: string;
  };
  icao: string;
  city: string; // Ciudad del aeropuerto
  country: Country; // País del aeropuerto
  //se agrego para el gps
  latitude: Coordinates; // Latitud con diferentes formatos
  longitude: Coordinates; // Longitud con diferentes formatos
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // Propiedades relacionadas con el usuario y autenticación
  aeropuertos: any;
  icao: string = '';
  isFavorite: { [key: string]: boolean } = {};
  aerops: Aerop[] = []; // Asume que tienes una lista de aeropuertos de la API

  //se agrego para el gps
  // Propiedades para latitud y longitud
  latitud: number | null = null;  // Aquí declaras latitud
  longitud: number | null = null;  // Aquí declaras longitud

  // Propiedades para país y provincia
  pais: string | null = null;  // Aquí declaras país
  provincia: string | null = null;  // Aquí declaras provincia

  // Propiedad para controlar la visibilidad de la ubicación
  mostrarUbicacion: boolean = false;  // Agregar esta línea
  // Propiedad para el aeropuerto más cercano
  aeropuertoCercano: Aerop | null = null; 

  constructor(
    private dataService: DataService,
    public api: WeatherApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.verificarUsuario();
    this.obtenerUbicacion(); // Llama a obtener ubicación al iniciar el componente/se agrego para el gps
    this.cargarFavoritos(); // Cargar los favoritos al iniciar el componente
    this.suscribirCambioIcao();

    // Actualizar ubicación cada media hora/se agrego para el gps
    setInterval(() => this.obtenerUbicacion(), 1800000);
  }
   /**
   * @function ionViewWillEnter
   * @description  Se ejecuta cada vez que el usuario vuelve a la vista
   * Este método se ejecuta cada vez que el usuario regresa a la página. Al llamarlo, actualizas el estado de los favoritos.
   * Llamada a actualizarEstadoFavoritos():
   * Dentro de ionViewWillEnter(), se llama a este método para que se asegure de que el estado de isFavorite esté actualizado al regresar a la página de inicio.
   */
  ionViewWillEnter() {
    this.actualizarEstadoFavoritos();// Actualiza el estado de favoritos al regresar
  }

  /**
   * @function verificarUsuario
   * @description Verifica si el usuario está autenticado y redirige si no lo está.
   */
  verificarUsuario() {
    this.auth.getUser().subscribe((res) => {
      if (!res) {
        this.router.navigate(['/login']);
      }
    });
  }

  /**
   * @function suscribirCambioIcao
   * @description Suscribe al cambio de ICAO en DataService.
   */
  suscribirCambioIcao() {
    this.dataService.currentIcao.subscribe((icao) => {
      if (icao) {
        this.icao = icao;
        this.buscar({ detail: { value: icao } });
      }
    });
  }

  /**
   * @function buscar
   * @description Busca información de un aeropuerto basado en el código ICAO.
   */
  buscar(event: any) {
    this.icao = event.detail.value;

    this.api.obtenerDatos(this.icao).subscribe(
      (data) => {
        this.aeropuertos = data;
      },
      (error) => {
        console.error('Error en búsqueda:', error);
      }
    );
  }

  /**
   * @function cargarFavoritos
   * @description Carga los aeropuertos favoritos desde el almacenamiento local.
   */
  cargarFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    favoritos.forEach((fav: any) => {
      this.isFavorite[fav.icao] = true; // Marca como favorito
    });
  }

  /**
   * @function actualizarEstadoFavoritos
   * @description Actualiza el estado de favoritos cuando se regresa a la vista.
   */
  actualizarEstadoFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    this.aeropuertos?.data.forEach((aeropuerto: any) => {
      this.isFavorite[aeropuerto.icao] = favoritos.some((fav: any) => fav.icao === aeropuerto.icao);
    });
  }

   /**
   * @function addToFavorites
   * @description se ejecuta cuando el usuario haga click en la estrella de favoritos
   * guarda el aeropuerto en el localstorage
   * Agrega o quita un aeropuerto de los favoritos.
  */
  addToFavorites(aerop: Aerop) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    const favorito = { name: aerop.station.name, icao: aerop.icao };

    if (!favoritos.some((fav: any) => fav.icao === aerop.icao)) {
      favoritos.push(favorito);
      this.isFavorite[aerop.icao] = true;
    } else {
      favoritos = favoritos.filter((fav: any) => fav.icao !== aerop.icao);
      this.isFavorite[aerop.icao] = false; // Actualizar el estado local
    }

    localStorage.setItem('favoritos', JSON.stringify(favoritos));
  }

  /**
   * @function obtenerUbicacion
   * @description Obtiene la ubicación GPS del usuario.
   */
  async obtenerUbicacion() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      this.latitud = coordinates.coords.latitude;
      this.longitud = coordinates.coords.longitude;
      console.log('Latitud:', this.latitud, 'Longitud:', this.longitud);

      await this.obtenerDireccion(this.latitud, this.longitud);
      await this.buscarAeropuertoMasCercano(this.latitud, this.longitud);

    } catch (error) {
      console.error('Error obteniendo la ubicación', error);
    }
  }

  /**
   * @function obtenerDireccion
   * @description Obtiene la dirección (país y provincia) basándose en la latitud y longitud.
   */
  async obtenerDireccion(latitud: number, longitud: number) {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
        params: { lat: latitud, lon: longitud, format: 'json' }
      });
      this.pais = response.data.address.country;
      this.provincia = response.data.address.state || response.data.address.prov;
      console.log('País:', this.pais, 'Provincia:', this.provincia);

    } catch (error) {
      console.error('Error obteniendo la dirección', error);
    }
  }

  /**
   * @function buscarAeropuertoMasCercano
   * @description Busca el aeropuerto más cercano a la ubicación actual.
   */
  async buscarAeropuertoMasCercano(latitud: number, longitud: number) {
    try {
      const response = await axios.get(`https://api.checkwx.com/station/lat/${latitud}/lon/${longitud}/?filter=A`, {
        headers: { 'X-API-Key': "ca21f8d774f04976b299456461" }
      });
      // Verifica si hay resultados
      if (response.data.results > 0 && Array.isArray(response.data.data) && response.data.data.length > 0) {
        const aeropuerto = response.data.data[0]; // Accede al primer aeropuerto en el array

        this.aeropuertoCercano = {
          station: { name: aeropuerto.name },
          icao: aeropuerto.icao,
          city: aeropuerto.city,
          country: { code: aeropuerto.country.code, name: aeropuerto.country.name },
          latitude: { decimal: aeropuerto.latitude.decimal, degrees: aeropuerto.latitude.degrees },
          longitude: { decimal: aeropuerto.longitude.decimal, degrees: aeropuerto.longitude.degrees },
        } as Aerop;

        console.log('Aeropuerto más cercano:', this.aeropuertoCercano);
      } else {
        console.log('No se encontró ningún aeropuerto.');
        this.aeropuertoCercano = null;
      }

    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Error obteniendo el aeropuerto más cercano:', error.response ? error.response.data : error.message);
      } else {
        console.error('Error desconocido:', error);
      }
    }
  }
  //cerrar ubicacion
  toggleUbicacion() {
    this.mostrarUbicacion = !this.mostrarUbicacion;
    if (this.mostrarUbicacion) {
      this.obtenerUbicacion();
    }
  }
}



