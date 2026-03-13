import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage) },
  { path: 'home', loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage), canActivate: [AuthGuard] },
  { path: 'pokemon-list', loadComponent: () => import('./pages/pokemon-list/pokemon-list.page').then(m => m.PokemonListPage), canActivate: [AuthGuard] },
  { path: 'pokemon-detail/:id', loadComponent: () => import('./pages/pokemon-detail/pokemon-detail.page').then(m => m.PokemonDetailPage), canActivate: [AuthGuard] },
  { path: 'favorites', loadComponent: () => import('./pages/favorites/favorites.page').then(m => m.FavoritesPage), canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' }
];
