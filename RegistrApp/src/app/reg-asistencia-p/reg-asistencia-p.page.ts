import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-reg-asistencia-p',
  templateUrl: './reg-asistencia-p.page.html',
  styleUrls: ['./reg-asistencia-p.page.scss'],
})
export class RegAsistenciaPPage implements OnInit {
  asignaturas: any[] = [];
  secciones: any[] = [];
  filteredAsignaturas: any[] = [];
  filteredSecciones: any[] = [];
  selectedAsignatura: any | null = null;
  selectedSeccion: any | null = null;
  qrData: string = '';
  fechaActual: string = '';
  rol: string = 'profesor';
  usuarioId: number | null = null;

  private asignaturasUrl = 'http://localhost:3000/asignaturas';
  private seccionUrl = 'http://localhost:3000/seccion';
  private asistenciaUrl = 'http://localhost:3000/asistencia';

  constructor(private http: HttpClient, private toastController: ToastController) {}

  ngOnInit() {
    this.loadUsuario();
  }

  private loadUsuario() {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const usuarioData = JSON.parse(usuario);
      this.usuarioId = usuarioData.IDusuario;
      this.loadSecciones(); 
    } else {
      console.error('Usuario no encontrado en localStorage.');
      this.showToast('No se encontró el usuario autenticado.');
    }
  }

  private loadSecciones() {
    this.http.get<any[]>(this.seccionUrl).subscribe(secciones => {
      if (this.usuarioId) {
        
        const usuarioSecciones = secciones.filter(seccion => 
          seccion.IDusuario === this.usuarioId
        );
        this.secciones = usuarioSecciones;

        
        const asignaturasIds = usuarioSecciones.map(seccion => seccion.IDasignatura);

        
        this.loadAsignaturas(asignaturasIds);
      }
    }, error => {
      console.error('Error al cargar las secciones:', error);
      this.showToast('Error al cargar las secciones.');
    });
  }

  private loadAsignaturas(asignaturasIds: number[]) {
    this.http.get<any[]>(this.asignaturasUrl).subscribe(asignaturas => {
      
      this.filteredAsignaturas = asignaturas.filter(asignatura =>
        asignaturasIds.includes(asignatura.IDasignatura)
      );
    }, error => {
      console.error('Error al cargar las asignaturas:', error);
      this.showToast('Error al cargar las asignaturas.');
    });
  }

  onAsignaturaChange() {
    if (this.selectedAsignatura && this.usuarioId) {
      
      this.filteredSecciones = this.secciones.filter(seccion => 
        seccion.IDasignatura === this.selectedAsignatura.IDasignatura && seccion.IDusuario === this.usuarioId
      );
      
      
      if (this.filteredSecciones.length === 0) {
        this.showToast('No hay secciones disponibles para la asignatura seleccionada.');
      }
      
     
      this.selectedSeccion = null;
    }
  }

  generateQR() {
    if (this.selectedSeccion && this.selectedAsignatura) {
      this.fechaActual = new Date().toISOString().split('T')[0];
      const asignatura = this.selectedAsignatura.nombre; 
      const seccion = this.selectedSeccion.seccion;
      const idSeccion = this.selectedSeccion.IDseccion;  

      
      const qrDataObj = {
        Asignatura: asignatura, 
        Seccion: seccion,
        Fecha: this.fechaActual,
        IDseccion: idSeccion,  
        IDasignatura: this.selectedAsignatura.IDasignatura 
      };

      this.qrData = JSON.stringify(qrDataObj);
      
      
      this.guardarAsistencia(idSeccion, this.fechaActual, this.rol, asignatura, seccion, this.selectedAsignatura.IDasignatura);
    } else {
      this.showToast('Por favor selecciona una asignatura y sección.');
    }
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color: 'danger'
    });
    toast.present();
  }

  private guardarAsistencia(idseccion: number, fecha: string, rol: string, asignatura: string, seccion: string, idAsignatura: number) {
    if (this.usuarioId === null) {
      this.showToast('No se encontró el usuario autenticado.');
      return;
    }

    this.http.get<any[]>(this.asistenciaUrl).subscribe(asistencias => {
      const lastId = asistencias.length > 0 ? Math.max(...asistencias.map(a => a.id)) : 0;
      const newId = lastId + 1;

      
      const nuevaAsistencia = {
        id: newId,
        fecha: fecha,
        rol: rol,
        asignaturaNombre: asignatura, 
        seccion: seccion,
        IDusuario: this.usuarioId,
        IDseccion: idseccion, 
        IDasignatura: idAsignatura 
      };

      this.http.post(this.asistenciaUrl, nuevaAsistencia).subscribe(() => {
        this.showToast('Asistencia registrada correctamente.');
      }, error => {
        console.error('Error al guardar la asistencia:', error);
        this.showToast('Error al guardar la asistencia.');
      });
    });
  }
}
