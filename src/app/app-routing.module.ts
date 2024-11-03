import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
//tratar de que se vean separados Login y registro
import { LoginComponent } from './login/login.component'; // Asegúrate de importar el LoginComponent
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { FavoritesComponent } from './favorites/favorites.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  // { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirigir al login por defecto
  // Otras rutas
  { path: 'favorites', component: FavoritesComponent }
];



@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

