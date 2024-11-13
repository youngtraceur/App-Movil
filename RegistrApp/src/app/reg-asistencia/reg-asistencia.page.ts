import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-reg-asistencia',
  templateUrl: './reg-asistencia.page.html',
  styleUrls: ['./reg-asistencia.page.scss'],
})
export class RegAsistenciaPage implements OnInit {
  isCameraModalOpen = false;
  isQRModalOpen = false;
  scannedData: string | null = null;
  scanTimeout: any; 

  private asistenciaUrl = 'http://localhost:3000/asistencia';
  private usuariosUrl = 'http://localhost:3000/usuarios';  // URL del archivo de usuarios
  private seccionUrl = 'http://localhost:3000/seccion';  // URL para obtener las secciones
  private rol: string = 'estudiante';

  constructor(private http: HttpClient, private toastController: ToastController) {}

  ngOnInit() {
    this.setRolEstudiante();
  }

  setCameraModalOpen(isOpen: boolean) {
    this.isCameraModalOpen = isOpen;
    if (isOpen) {
      this.startScanTimeout(); 
    } else {
      this.clearScanTimeout();
    }
  }

  startScanTimeout() {
    this.scanTimeout = setTimeout(() => {
      this.stopQRScanner(); 
      this.showToast('La cámara se ha cerrado por inactividad.');
    }, 30000); 
  }

  clearScanTimeout() {
    if (this.scanTimeout) {
      clearTimeout(this.scanTimeout);
    }
  }

  async scanQR() {
    try {
      await BarcodeScanner.checkPermission({ force: true });

      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        this.scannedData = result.content;
        console.log('Datos escaneados:', this.scannedData);
        this.registrarAsistencia(this.scannedData);
        this.setCameraModalOpen(false); 
      } else {
        console.log('No se detectó contenido en el código QR.');
        this.showToast('No se detectó contenido en el código QR.');
      }

      await BarcodeScanner.stopScan();
    } catch (error) {
      console.error('Error al escanear el código QR:', error);
      this.showToast('Error al escanear el código QR.');
    }
  }

  async stopQRScanner() {
    // Detiene el escáner de código QR
    await BarcodeScanner.stopScan();
    this.setCameraModalOpen(false); // Cerrar la cámara
  }

  private async registrarAsistencia(qrData: string) {
    try {
      const parsedData = JSON.parse(qrData);

      const asistencia = JSON.parse(localStorage.getItem('asistencia') || '[]');
      const newId = asistencia.length > 0 ? asistencia[asistencia.length - 1].id + 1 : 1;

      const storedUsuarioId = localStorage.getItem('IDusuario');
      if (!storedUsuarioId) {
        this.showToast('No se encontró el usuario autenticado.');
        return;
      }

      const usuarioId = parseInt(storedUsuarioId, 10);

      // Obtener IDasignatura desde localStorage
      const storedIDasignatura = localStorage.getItem('IDasignatura');
      if (!storedIDasignatura) {
        this.showToast('No se encontró la asignatura registrada en el usuario.');
        return;
      }

      // Comparar IDasignatura del QR con el de localStorage
      if (parsedData.IDasignatura !== parseInt(storedIDasignatura, 10)) {
        this.showToast('El código QR no corresponde a la asignatura registrada.');
        return;
      }

      const existeAsistencia = await this.verificarAsistenciaExistenteEnServidor(usuarioId, parsedData.IDseccion);
      if (existeAsistencia) {
        this.showToast('Ya has registrado asistencia para esta asignatura y sección.');
        return;
      }

      this.http.get(`${this.usuariosUrl}?id=${usuarioId}`).subscribe((usuarios: any) => {
        if (usuarios.length === 0) {
          this.showToast('Usuario no encontrado.');
          return;
        }

        const usuario = usuarios[0];
        const usuarioIDseccion = usuario.IDseccion;

        this.http.get(`${this.seccionUrl}?IDseccion=${usuarioIDseccion}`).subscribe((secciones: any) => {
          if (secciones.length === 0) {
            this.showToast('Sección no encontrada.');
            return;
          }

          const seccion = secciones[0];
          const seccionIDasignatura = seccion.IDasignatura;
          if (parsedData.IDasignatura !== seccionIDasignatura) {
            this.showToast('Estudiante no corresponde a esta asignatura');
            return; 
          }

          if (parsedData.IDseccion !== usuarioIDseccion) {
            this.showToast('Estudiante no corresponde a esta sección');
            return; 
          }

          const nuevaAsistencia = {
            id: newId,
            fecha: parsedData.Fecha,
            rol: this.rol,
            carreraId: parsedData.IDcarrera,
            asignaturaNombre: parsedData.Asignatura,
            seccion: parsedData.Seccion,
            IDusuario: usuarioId,
            IDseccion: parsedData.IDseccion, 
            IDasignatura: parsedData.IDasignatura,
          };

          const updatedAsistencia = [...asistencia, nuevaAsistencia];
          localStorage.setItem('asistencia', JSON.stringify(updatedAsistencia));

          this.http.post(this.asistenciaUrl, nuevaAsistencia).subscribe(() => {
            this.showToast('Asistencia registrada correctamente.');
          }, error => {
            console.error('Error al registrar la asistencia:', error);
            this.showToast('Error al registrar la asistencia.');
          });

        }, error => {
          console.error('Error al obtener la sección:', error);
          this.showToast('Error al obtener la sección.');
        });

      }, error => {
        console.error('Error al obtener la información del usuario:', error);
        this.showToast('Error al obtener la información del usuario.');
      });
    } catch (error) {
      console.error('Error al procesar los datos del QR:', error);
      this.showToast('Error al procesar los datos del QR.');
    }
  }

  private async verificarAsistenciaExistenteEnServidor(usuarioId: number, idSeccion: number): Promise<boolean> {
    try {
      const asistenciaExistente: any = await this.http.get(`${this.asistenciaUrl}?IDusuario=${usuarioId}&IDseccion=${idSeccion}`).toPromise();
      
      if (Array.isArray(asistenciaExistente)) {
        return asistenciaExistente.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error('Error al verificar asistencia desde el servidor:', error);
      this.showToast('Error al verificar asistencia.');
      return false;
    }
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

  private setRolEstudiante() {
    this.rol = 'estudiante';
    console.log('El rol se ha cambiado a estudiante.');
  }
}
