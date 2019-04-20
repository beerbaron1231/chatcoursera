import { Component, OnInit, NgZone } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/providers/auth-service.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  mensaje = '';
  to = '';
  elementoChat: any;
  loading = false;
  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone
  ) {
    this.loading = true;
    setTimeout( ()=>{
    this.authService.cargarMensajes(this.authService.userData).subscribe(
    () => {
      setTimeout( ()=>{
        this.elementoChat = document.getElementById('app-mensajes');
        this.elementoChat.scrollTop = this.elementoChat.scrollHeight;
        this.loading=false;
      },20);


    }

  ); }, 2000); 
}



  ngOnInit() {

  }
enviar_mensaje() {
  if ( this.mensaje.length === 0) {
    return;
  }
  this.authService.agregarMensaje(this.mensaje, this.to)
  .then( () => {
    this.mensaje = '';
    this.to = '';
  })
  .catch( (err) => console.error('Error al enviar %s', err));

}
}