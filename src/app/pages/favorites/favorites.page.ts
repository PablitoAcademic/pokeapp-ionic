import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IonHeader,IonToolbar,IonTitle,IonContent,IonButtons,IonMenuButton,IonButton,IonIcon,IonSpinner,AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, heartDislikeOutline, trashOutline, searchOutline } from 'ionicons/icons';
import { PokemonService, Pokemon } from '../../services/pokemon.service';

@Component({ selector:'app-favorites', templateUrl:'./favorites.page.html', styleUrls:['./favorites.page.scss'], standalone:true,
  imports:[CommonModule,RouterLink,IonHeader,IonToolbar,IonTitle,IonContent,IonButtons,IonMenuButton,IonButton,IonIcon,IonSpinner] })
export class FavoritesPage implements OnInit {
  favoritePokemons: Pokemon[]=[]; isLoading=true;
  constructor(private router:Router, private poke:PokemonService, private ac:AlertController) {
    addIcons({heart,heartDislikeOutline,trashOutline,searchOutline});
  }
  ngOnInit(){this.loadFavorites();}
  ionViewWillEnter(){this.loadFavorites();}
  loadFavorites(){this.isLoading=true;this.poke.getFavoritesPokemons().subscribe({next:p=>{this.favoritePokemons=p;this.isLoading=false;},error:()=>this.isLoading=false});}
  goDetail(id:number){this.router.navigate(['/pokemon-detail',id]);}
  async removeFav(e:Event, p:Pokemon){
    e.stopPropagation();
    const a=await this.ac.create({header:'Eliminar favorito',message:`¿Eliminar a ${p.name}?`,cssClass:'custom-alert',
      buttons:[{text:'Cancelar',role:'cancel'},{text:'Eliminar',role:'destructive',handler:()=>{this.poke.toggleFavorite(p.id);this.favoritePokemons=this.favoritePokemons.filter(x=>x.id!==p.id);}}]});
    await a.present();
  }
  async clearAll(){
    if(!this.favoritePokemons.length)return;
    const a=await this.ac.create({header:'Limpiar favoritos',message:'¿Eliminar todos?',cssClass:'custom-alert',
      buttons:[{text:'Cancelar',role:'cancel'},{text:'Eliminar todos',role:'destructive',handler:()=>{this.favoritePokemons.forEach(p=>this.poke.toggleFavorite(p.id));this.favoritePokemons=[];}}]});
    await a.present();
  }
  getArt(p:Pokemon){return this.poke.getOfficialArtwork(p);}
  getColor(t:string){return this.poke.getTypeColor(t);}
  primaryType(p:Pokemon){return p.types?.[0]?.type?.name||'normal';}
  fmtId(id:number){return `#${String(id).padStart(3,'0')}`;}
  trackBy(_:number,p:Pokemon){return p.id;}
}
