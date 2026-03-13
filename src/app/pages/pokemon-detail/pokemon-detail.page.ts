import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonHeader,IonToolbar,IonTitle,IonContent,IonButtons,IonButton,IonIcon,IonBadge,IonSpinner,IonBackButton,IonMenuButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heartOutline,heart,resizeOutline,barbellOutline,flashOutline,sparklesOutline } from 'ionicons/icons';
import { forkJoin } from 'rxjs';
import { PokemonService, Pokemon, PokemonSpecies } from '../../services/pokemon.service';

@Component({ selector:'app-pokemon-detail', templateUrl:'./pokemon-detail.page.html', styleUrls:['./pokemon-detail.page.scss'], standalone:true,
  imports:[CommonModule,IonHeader,IonToolbar,IonTitle,IonContent,IonButtons,IonButton,IonIcon,IonBadge,IonSpinner,IonBackButton,IonMenuButton] })
export class PokemonDetailPage implements OnInit {
  pokemon: Pokemon|null=null; species: PokemonSpecies|null=null;
  isLoading=true; isFavorite=false; activeTab='stats'; errorMessage='';

  constructor(private route:ActivatedRoute, private router:Router, private poke:PokemonService) {
    addIcons({heartOutline,heart,resizeOutline,barbellOutline,flashOutline,sparklesOutline});
  }
  ngOnInit() {
    const id=this.route.snapshot.paramMap.get('id');
    if(!id){this.router.navigate(['/pokemon-list']);return;}
    forkJoin({pokemon:this.poke.getPokemonById(id),species:this.poke.getPokemonSpecies(id)}).subscribe({
      next:({pokemon,species})=>{this.pokemon=pokemon;this.species=species;this.isFavorite=this.poke.isFavorite(pokemon.id);this.isLoading=false;},
      error:e=>{this.errorMessage=e.message||'Error al cargar';this.isLoading=false;}
    });
    this.poke.favorites$.subscribe(f=>{if(this.pokemon)this.isFavorite=f.includes(this.pokemon.id);});
  }
  toggleFav(){if(this.pokemon){this.poke.toggleFavorite(this.pokemon.id);this.isFavorite=!this.isFavorite;}}
  getArt(){return this.pokemon?this.poke.getOfficialArtwork(this.pokemon):'';}
  getColor(t:string){return this.poke.getTypeColor(t);}
  primaryColor(){return this.pokemon?this.poke.getTypeColor(this.pokemon.types[0]?.type?.name||'normal'):'#68a090';}
  fmtStat(s:string){return this.poke.formatStatName(s);}
  statPct(v:number){return Math.min(100,(v/255)*100);}
  statColor(v:number){return v>=100?'#2dd36f':v>=70?'#ffc409':v>=40?'#ff8c00':'#eb445a';}
  flavorText(){if(!this.species)return '';const e=this.species.flavor_text_entries.find(x=>x.language.name==='es')||this.species.flavor_text_entries.find(x=>x.language.name==='en');return e?e.flavor_text.replace(/\f/g,' ').replace(/\n/g,' '):'';}
  genus(){if(!this.species)return '';const g=this.species.genera?.find(x=>x.language.name==='es')||this.species.genera?.find(x=>x.language.name==='en');return g?.genus||'';}
  fmtId(id:number){return `#${String(id).padStart(3,'0')}`;}
  fmtH(h:number){return `${(h/10).toFixed(1)} m`;}
  fmtW(w:number){return `${(w/10).toFixed(1)} kg`;}
  goBack(){this.router.navigate(['/pokemon-list']);}
  setTab(t:string){this.activeTab=t;}
}
