import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonHeader,IonToolbar,IonTitle,IonContent,IonButtons,IonButton,IonIcon,IonCard,IonMenuButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heartOutline,heart,layersOutline,starOutline,personCircle,chevronForward } from 'ionicons/icons';
import { AuthService, User } from '../../services/auth.service';
import { PokemonService, Pokemon } from '../../services/pokemon.service';

@Component({ selector:'app-home', templateUrl:'./home.page.html', styleUrls:['./home.page.scss'], standalone:true,
  imports:[CommonModule,IonHeader,IonToolbar,IonTitle,IonContent,IonButtons,IonButton,IonIcon,IonCard,IonMenuButton] })
export class HomePage implements OnInit {
  currentUser: User|null=null; featuredPokemons: Pokemon[]=[]; isLoading=true; totalPokemon=1010; favoritesCount=0;
  constructor(private router:Router, private auth:AuthService, private poke:PokemonService) {
    addIcons({heartOutline,heart,layersOutline,starOutline,personCircle,chevronForward});
  }
  ngOnInit() {
    this.currentUser=this.auth.currentUser;
    this.poke.favorites$.subscribe(f=>this.favoritesCount=f.length);
    Promise.all([1,4,7,25,133,39].map(id=>this.poke.getPokemonById(id).toPromise())).then(r=>{this.featuredPokemons=r.filter(Boolean) as Pokemon[];this.isLoading=false;}).catch(()=>this.isLoading=false);
  }
  getArt(p:Pokemon){return this.poke.getOfficialArtwork(p);}
  getColor(t:string){return this.poke.getTypeColor(t);}
  primaryType(p:Pokemon){return p.types?.[0]?.type?.name||'normal';}
  fmtId(id:number){return `#${String(id).padStart(3,'0')}`;}
  goList(){this.router.navigate(['/pokemon-list']);}
  goFav(){this.router.navigate(['/favorites']);}
  goDetail(id:number){this.router.navigate(['/pokemon-detail',id]);}
}
