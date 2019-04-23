import { Component, OnInit, NgZone } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/providers/auth-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  message = '';
  to = '';
  elementoChat: any;
  loading = false;
  basededatos: any[] = [];
  loading2 = false;
  basededatosusers: any[] = []
  basededatositems: any[] = []
  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  }
  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone
  ) {
    this.loading = true;
    setTimeout(() => {
      this.authService.loadMessage(this.authService.userData).subscribe(
        () => {
          setTimeout(() => {
            this.elementoChat = document.getElementById('app-mensajes');
            this.elementoChat.scrollTop = this.elementoChat.scrollHeight;
            this.loading = false;
          }, 20);


        }

      );
    }, 2000);
  }



  ngOnInit() {

  }
  getdataitems() {

    this.basededatositems = [];
    this.basededatosusers = [];
    this.authService.getdatabase().subscribe(
      respuesta => {
        this.loading2 = true;
        this.basededatositems.push({ message: respuesta });
        this.loading2 = false;
      });
    return this.basededatositems;
  }

  getdatausers() {
    this.basededatosusers = [];
    this.basededatositems = [];
    this.authService.getdatabase2().subscribe(
      repsuesta2 => {
        this.basededatosusers.push({ users: repsuesta2 });


        this.loading2 = false;
      });
    return this.basededatosusers;
  }


  send_message() {
    if (this.message.length === 0) {
      return;
    }
    if (this.to.length === 0) {
      return;
    }


    this.authService.addMessage(this.message, this.to)
      .then(() => {
        this.message = '';
        this.to = '';
      })
      .catch((err) => console.error('Error al enviar %s', err));

  }





}