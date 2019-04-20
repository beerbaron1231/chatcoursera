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
  getdata() {

    this.authService.getdatabase().subscribe(
      respuesta => {
        this.loading2 = true;
        this.basededatos = [];
        this.basededatos.push({ items: respuesta });
        this.authService.getdatabase2().subscribe(
          repsuesta2 => {
            this.basededatos.push({ users: repsuesta2 });
            this.dyanmicDownloadByHtmlTag({
              fileName: 'dbdump.txt',
              text: JSON.stringify(this.basededatos)
            });
            this.loading2 = false;
          });
      });


    return this.basededatos;
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

  dynamicDownloadTxt() {
     this.authService.getdatabase().subscribe(
      respuesta => {
        this.loading2 = true;
        this.basededatos = [];
        this.basededatos.push({ items: respuesta });
        this.authService.getdatabase2().subscribe(
          repsuesta2 => {
            this.basededatos.push({ users: repsuesta2 });
            this.dyanmicDownloadByHtmlTag({
              fileName: 'dbdump.txt',
              text: JSON.stringify(this.basededatos)
            });
            this.loading2 = false;
          });
      });


    //return this.basededatos;


  }


  
  private dyanmicDownloadByHtmlTag(arg: {
    fileName: string,
    text: string
  }) {
    console.log("entro")
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
    element.setAttribute('download', arg.fileName);

    var event = new MouseEvent("click");
    element.dispatchEvent(event);
  }

}