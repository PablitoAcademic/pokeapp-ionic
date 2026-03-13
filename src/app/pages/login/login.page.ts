import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonInput, IonButton, IonIcon, LoadingController, ToastController, AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, enterOutline, eyeOutline, eyeOffOutline, alertCircleOutline, informationCircleOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({ selector:'app-login', templateUrl:'./login.page.html', styleUrls:['./login.page.scss'], standalone:true,
  imports:[CommonModule, ReactiveFormsModule, IonContent, IonInput, IonButton, IonIcon] })
export class LoginPage implements OnInit {
  loginForm!: FormGroup; showPassword=false; isAnimating=false;
  constructor(private fb:FormBuilder, private router:Router, private auth:AuthService, private lc:LoadingController, private tc:ToastController, private ac:AlertController) {
    addIcons({mailOutline,lockClosedOutline,enterOutline,eyeOutline,eyeOffOutline,alertCircleOutline,informationCircleOutline});
  }
  ngOnInit() {
    if(this.auth.isLoggedIn){this.router.navigateByUrl('/home',{replaceUrl:true});return;}
    this.loginForm=this.fb.group({email:['',[Validators.required,Validators.email]],password:['',[Validators.required,Validators.minLength(6)]]});
  }
  get emailCtrl(){return this.loginForm.get('email');} get passCtrl(){return this.loginForm.get('password');}
  togglePassword(){this.showPassword=!this.showPassword;}
  async onLogin(){
    if(this.loginForm.invalid){this.loginForm.markAllAsTouched();return;}
    const l=await this.lc.create({message:'Iniciando sesión...',spinner:'crescent',cssClass:'custom-loading'});
    await l.present();
    try{await this.auth.login(this.loginForm.value);await l.dismiss();this.isAnimating=true;setTimeout(()=>this.router.navigateByUrl('/home',{replaceUrl:true}),400);}
    catch(e:any){await l.dismiss();const t=await this.tc.create({message:e.message,duration:3000,position:'bottom',color:'danger',icon:'alert-circle-outline'});await t.present();}
  }
  async showDemoCredentials(){
    const a=await this.ac.create({header:'🎮 Credenciales Demo',cssClass:'custom-alert',
      message:'<div style="line-height:1.8"><strong>Demo:</strong><br>📧 demo@demo.com<br>🔑 demo123<br><br><strong>Ash:</strong><br>📧 ash@pokemon.com<br>🔑 pikachu123</div>',
      buttons:[{text:'Usar Demo',handler:()=>this.loginForm.setValue({email:'demo@demo.com',password:'demo123'})},{text:'Cerrar',role:'cancel'}]});
    await a.present();
  }
}
