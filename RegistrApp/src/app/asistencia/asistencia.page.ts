import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit {
  asistencias: any[] = [];  // Array para almacenar las asistencias
  private asistenciaUrl = 'http://localhost:3000/asistencia'; // URL para obtener las asistencias de db.json

  constructor(private http: HttpClient, private toastController: ToastController) {}

  ngOnInit() {
    this.obtenerAsistencias(); // Cargar las asistencias al inicializar el componente
  }

  // Método para obtener las asistencias y filtrarlas por IDusuario
  private obtenerAsistencias() {
    // Obtener el IDusuario desde localStorage
    const storedUsuarioId = localStorage.getItem('IDusuario');
    if (!storedUsuarioId) {
      this.showToast('No se encontró el usuario autenticado.');
      return; // Si no se encuentra el IDusuario, salimos del método
    }

    const usuarioId = parseInt(storedUsuarioId, 10); // Convertimos el IDusuario a número

    // Realizar la solicitud GET para obtener las asistencias desde db.json
    this.http.get<any[]>(this.asistenciaUrl).subscribe(
      (asistencias) => {
        // Filtrar las asistencias que correspondan al IDusuario
        this.asistencias = asistencias.filter((asistencia) => asistencia.IDusuario === usuarioId);
        
        if (this.asistencias.length === 0) {
          this.showToast('No se encontraron asistencias para el usuario.');
        }
      },
      (error) => {
        console.error('Error al obtener las asistencias:', error);
        this.showToast('Error al obtener las asistencias.');
      }
    );
  }

  // Método para mostrar el toast
  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000, // Duración de 3 segundos
      position: 'top', // Posición del toast en la pantalla
      color: message.includes('Error') ? 'danger' : 'success', // Establece el color basado en el mensaje
    });
    toast.present();
  }
}
