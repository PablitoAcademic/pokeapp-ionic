import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { IonHeader,IonToolbar,IonTitle,IonContent,IonButtons,IonMenuButton,IonIcon,IonInput,IonInfiniteScroll,IonInfiniteScrollContent,IonSpinner,ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline, closeCircle, heartOutline, heart } from 'ionicons/icons';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PokemonService, Pokemon } from '../../services/pokemon.service';

@Component({ selector:'app-pokemon-list', templateUrl:'./pokemon-list.page.html', styleUrls:['./pokemon-list.page.scss'], standalone:true,
  imports:[CommonModule,ReactiveFormsModule,IonHeader,IonToolbar,IonTitle,IonContent,IonButtons,IonMenuButton,IonIcon,IonInput,IonInfiniteScroll,IonInfiniteScrollContent,IonSpinner] })
export class PokemonListPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;
  pokemons: Pokemon[]=[]; searchResults: Pokemon[]=[]; isLoading=true; isSearching=false; searchMode=false;
  currentOffset=0; readonly pageSize=20; searchCtrl=new FormControl(''); selectedType: string|null=null; favorites: number[]=[];
  readonly types=['fire','water','grass','electric','psychic','ice','dragon','dark','fairy','fighting','bug','normal','rock','ground','steel','flying','poison','ghost'];

  constructor(private router:Router, private poke:PokemonService, private tc:ToastController) {
    addIcons({searchOutline,closeCircle,heartOutline,heart});
  }
  ngOnInit() {
    this.loadPokemons();
    this.poke.favorites$.subscribe(f=>this.favorites=f);
    this.searchCtrl.valueChanges.pipe(debounceTime(500),distinctUntilChanged()).subscribe(q=>{
      if(!q?.trim()){this.searchMode=false;this.searchResults=[];return;}
      this.isSearching=true;this.searchMode=true;
      this.poke.searchPokemon(q.trim().toLowerCase()).subscribe({next:p=>{this.searchResults=[p];this.isSearching=false;},error:()=>{this.searchResults=[];this.isSearching=false;}});
    });
  }
  loadPokemons(ev?: any) {
    if(this.currentOffset===0)this.isLoading=true;
    this.poke.getPokemonList(this.currentOffset,this.pageSize).subscribe({
      next:r=>{this.pokemons=[...this.pokemons,...r];this.currentOffset+=this.pageSize;this.isLoading=false;if(ev)ev.target.complete();if(r.length<this.pageSize&&this.infiniteScroll)this.infiniteScroll.disabled=true;},
      error:async()=>{this.isLoading=false;if(ev)ev.target.complete();const t=await this.tc.create({message:'Error al cargar pokémon',duration:3000,color:'danger'});await t.present();}
    });
  }
  loadMore(ev:any){this.loadPokemons(ev);}
  clearSearch(){this.searchCtrl.setValue('');this.searchMode=false;this.searchResults=[];}
  selectType(t:string){this.selectedType=this.selectedType===t?null:t;}
  get displayed(){if(this.searchMode)return this.searchResults;if(this.selectedType)return this.pokemons.filter(p=>p.types.some(t=>t.type.name===this.selectedType));return this.pokemons;}
  goDetail(id:number){this.router.navigate(['/pokemon-detail',id]);}
  getArt(p:Pokemon){return this.poke.getOfficialArtwork(p);}
  getColor(t:string){return this.poke.getTypeColor(t);}
  primaryType(p:Pokemon){return p.types?.[0]?.type?.name||'normal';}
  isFav(id:number){return this.favorites.includes(id);}
  toggleFav(e:Event,id:number){e.stopPropagation();this.poke.toggleFavorite(id);}
  fmtId(id:number){return `#${String(id).padStart(3,'0')}`;}
  trackBy(_:number,p:Pokemon){return p.id;}
}
