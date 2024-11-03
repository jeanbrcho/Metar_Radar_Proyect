import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';//Importa LoginComponent

// Importaciones de Firebase y el módulo de autenticación
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment'; // Importar la configuración de Firebase
import { FormsModule } from '@angular/forms';
//registro
import { RegisterComponent } from './register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { WeatherApiService } from './service/weather-api.service';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './plantillas/header/header.component';
import { FooterComponent } from './plantillas/footer/footer.component';
import { FavoritesComponent } from './favorites/favorites.component';

@NgModule({
  declarations: [AppComponent,LoginComponent, RegisterComponent, HomeComponent, HeaderComponent, FooterComponent,FavoritesComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase), // Inicialización de Firebase
    AngularFireAuthModule, // Módulo de autenticación de Firebase
    FormsModule, //Agregado cuando aparecieron los errores
    HttpClientModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, WeatherApiService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
