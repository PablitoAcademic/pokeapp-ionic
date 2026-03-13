import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonApp, IonMenu, IonHeader, IonToolbar, IonContent, IonList,
  IonItem, IonLabel, IonIcon, IonBadge, IonRouterOutlet, IonMenuToggle, MenuController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  homeOutline, listOutline, heartOutline, heart, logOutOutline,
  personCircleOutline, shieldCheckmarkOutline, chevronForwardOutline
} from 'ionicons/icons';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive,
    IonApp, IonMenu, IonHeader, IonToolbar, IonContent, IonList,
    IonItem, IonLabel, IonIcon, IonBadge, IonRouterOutlet, IonMenuToggle]
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Inicio',    url: '/home',         icon: 'home-outline',  color: 'primary' },
    { title: 'Pokédex',   url: '/pokemon-list', icon: 'list-outline',  color: 'success' },
    { title: 'Favoritos', url: '/favorites',    icon: 'heart-outline', color: 'danger'  }
  ];
  currentUser: any = null;

  constructor(private router: Router, private authService: AuthService, private menuCtrl: MenuController) {
    addIcons({ homeOutline, listOutline, heartOutline, heart, logOutOutline, personCircleOutline, shieldCheckmarkOutline, chevronForwardOutline });
  }

  ngOnInit() { this.authService.currentUser$.subscribe(u => this.currentUser = u); }

  async logout() { await this.menuCtrl.close(); this.authService.logout(); this.router.navigateByUrl('/login', { replaceUrl: true }); }
  closeMenu() { this.menuCtrl.close(); }
}
