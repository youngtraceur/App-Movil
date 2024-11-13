import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; 

@Component({
  selector: 'app-ingresar',
  templateUrl: './ingresar.page.html',
  styleUrls: ['./ingresar.page.scss'],
})
export class IngresarPage implements OnInit {
  usuario: string = '';
  contrasena: string = '';
  error: boolean = false;
  rol: string = '';

  private apiUrl = 'http://localhost:3000/usuarios'; 

  constructor(private toastController: ToastController, private router: Router, private http: HttpClient) {}

  ngOnInit() {}

  async ingresar() {
    const credentials = {
      usuario: this.usuario,
      contrasena: this.contrasena,
    };

    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (usuarios) => {
        const user = usuarios.find(u => u.usuario === this.usuario && u.contrasena === this.contrasena);
        
        if (user) {
          console.log(`Ingreso exitoso como ${user.rol}`);
          this.rol = user.rol; 
          localStorage.setItem('usuario', JSON.stringify(user)); 
          localStorage.setItem('IDusuario', user.IDusuario); 
          localStorage.setItem('rol', this.rol);

        
          this.router.navigate(['/menu']); 
        } else {
          this.mostrarError();
        }
      },
      error: (err) => {
        console.error('Error en la solicitud:', err);
        this.mostrarError();
      }
    });
  }

  async mostrarError() {
    this.error = true;
    const toast = await this.toastController.create({
      message: 'Datos ingresados no válidos',
      duration: 3000,
      position: 'middle',
      color: 'primary',
    });
    await toast.present();
  }
}
