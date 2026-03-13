import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

export interface Pokemon { id:number; name:string; base_experience:number; height:number; weight:number; order:number; abilities:any[]; moves:any[]; sprites:any; stats:any[]; types:any[]; }
export interface PokemonSpecies { flavor_text_entries:{flavor_text:string;language:{name:string};version:{name:string}}[]; genera:{genus:string;language:{name:string}}[]; color:{name:string}; capture_rate:number; base_happiness:number; is_legendary:boolean; is_mythical:boolean; }

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private API = 'https://pokeapi.co/api/v2';
  private favKey = 'pokeapp_favorites';
  private favsSub = new BehaviorSubject<number[]>(this.loadFavs());
  favorites$ = this.favsSub.asObservable();

  constructor(private http: HttpClient) {}

  getPokemonList(offset=0, limit=20): Observable<Pokemon[]> {
    return this.http.get<any>(`${this.API}/pokemon?limit=${limit}&offset=${offset}`).pipe(
      switchMap((r: any) => forkJoin<Pokemon[]>(r.results.map((p: any) => this.http.get<Pokemon>(p.url)))),
      catchError(this.handleError)
    );
  }
  getPokemonById(id: number|string): Observable<Pokemon> { return this.http.get<Pokemon>(`${this.API}/pokemon/${id}`).pipe(catchError(this.handleError)); }
  getPokemonSpecies(id: number|string): Observable<PokemonSpecies> { return this.http.get<PokemonSpecies>(`${this.API}/pokemon-species/${id}`).pipe(catchError(this.handleError)); }
  searchPokemon(q: string): Observable<Pokemon> { return this.http.get<Pokemon>(`${this.API}/pokemon/${q.toLowerCase()}`).pipe(catchError(this.handleError)); }
  getFavoritesPokemons(): Observable<Pokemon[]> {
    const ids = this.favsSub.value;
    if (!ids.length) return new Observable(o => { o.next([]); o.complete(); });
    return forkJoin(ids.map(id => this.getPokemonById(id)));
  }
  get favorites() { return this.favsSub.value; }
  isFavorite(id: number) { return this.favorites.includes(id); }
  toggleFavorite(id: number) { const c=[...this.favorites]; const i=c.indexOf(id); if(i===-1)c.push(id);else c.splice(i,1); localStorage.setItem(this.favKey,JSON.stringify(c)); this.favsSub.next(c); }
  getOfficialArtwork(p: Pokemon): string { return p.sprites?.other?.['official-artwork']?.front_default||`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`; }
  getTypeColor(t: string): string { const c:Record<string,string>={normal:'#A8A878',fire:'#F08030',water:'#6890F0',electric:'#F8D030',grass:'#78C850',ice:'#98D8D8',fighting:'#C03028',poison:'#A040A0',ground:'#E0C068',flying:'#A890F0',psychic:'#F85888',bug:'#A8B820',rock:'#B8A038',ghost:'#705898',dragon:'#7038F8',dark:'#705848',steel:'#B8B8D0',fairy:'#EE99AC'}; return c[t]||'#68A090'; }
  formatStatName(s: string): string { const n:Record<string,string>={'hp':'HP','attack':'Ataque','defense':'Defensa','special-attack':'Atk. Esp.','special-defense':'Def. Esp.','speed':'Velocidad'}; return n[s]||s; }
  private loadFavs(): number[] { try { const s=localStorage.getItem(this.favKey); return s?JSON.parse(s):[]; } catch { return []; } }
  private handleError(e: HttpErrorResponse) { return throwError(()=>new Error(e.status===404?'Pokémon no encontrado':e.status===0?'Sin conexión':'Error inesperado')); }
}
