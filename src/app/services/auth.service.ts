import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export interface User { id: string; name: string; email: string; token: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private KEY = 'pokeapp_user';
  private sub = new BehaviorSubject<User | null>(this.load());
  currentUser$ = this.sub.asObservable();
  get currentUser() { return this.sub.value; }
  get isLoggedIn()  { return !!this.sub.value; }

  private USERS = [
    { email:'ash@pokemon.com',   password:'pikachu123', name:'Ash Ketchum',     id:'1', token:'t1' },
    { email:'misty@pokemon.com', password:'staryu123',  name:'Misty',           id:'2', token:'t2' },
    { email:'demo@demo.com',     password:'demo123',    name:'Entrenador Demo', id:'3', token:'t3' }
  ];

  async login(c: { email: string; password: string }): Promise<User> {
    await new Promise(r => setTimeout(r, 1000));
    const u = this.USERS.find(x => x.email === c.email && x.password === c.password);
    if (!u) throw new Error('Credenciales incorrectas. Verifica tu email y contraseña.');
    const user: User = { id: u.id, name: u.name, email: u.email, token: u.token };
    localStorage.setItem(this.KEY, JSON.stringify(user));
    this.sub.next(user);
    return user;
  }

  logout() { localStorage.removeItem(this.KEY); this.sub.next(null); }

  private load(): User | null {
    try { const s = localStorage.getItem(this.KEY); return s ? JSON.parse(s) : null; } catch { return null; }
  }
}
