import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Para redirigir después del cambio
import { HttpClient } from '@angular/common/http'; // Para interactuar con el servidor
import { ToastController } from '@ionic/angular'; // Para mostrar mensajes de confirmación

@Component({
  selector: 'app-cambiar-clave',
  templateUrl: './cambiar-clave.page.html',
  styleUrls: ['./cambiar-clave.page.scss'],
})
export class CambiarClavePage implements OnInit {

  correo: string = ''; // Nombre de usuario (en este caso, el 'correo' es el usuario)
  contrasenaActual: string = '';
  nuevaContrasena: string = '';
  confirmarContrasena: string = '';

  private usuariosUrl = 'http://localhost:3000/usuarios'; // URL de la API para obtener los usuarios

  constructor(private http: HttpClient, private router: Router, private toastController: ToastController) { }

  ngOnInit() {}

  async cambiarContrasena() {
    
    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.showToast('Las contraseñas no coinciden.');
      return;
    }

   
    this.http.get<any[]>(this.usuariosUrl).subscribe((usuarios) => {
      const usuario = usuarios.find(u => u.usuario === this.correo);

      if (usuario) {
        
        if (usuario.contrasena === this.contrasenaActual) {
          
          usuario.contrasena = this.nuevaContrasena;

      
          this.http.put(`${this.usuariosUrl}/${usuario.id}`, usuario).subscribe(() => {
            this.showToast('Contrasena cambiada correctamente.');
            this.router.navigate(['/ingresar']); 
          }, error => {
            console.error('Error al actualizar la contrasena:', error);
            this.showToast('Error al cambiar la contrasena.');
          });
        } else {
          this.showToast('La contrasena actual no es correcta.');
        }
      } else {
        this.showToast('No se encontro un usuario con ese nombre de usuario.');
      }
    }, error => {
      console.error('Error al obtener los usuarios:', error);
      this.showToast('Error al obtener los datos del usuario.');
    });
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: message.includes('Error') ? 'danger' : 'success',
    });
    toast.present();
  }
}
