import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MenuController } from '@ionic/angular'; 

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  nombre: string = '';
  isTeacher: boolean = false;
  isStudent: boolean = false;
  idCarrera: number | null = null; // Agregar IDcarrera como propiedad

  private apiUrl = 'http://localhost:3000/usuarios';

  constructor(private router: Router, private http: HttpClient, private menuController: MenuController) {} 

  ngOnInit() {
    this.menuController.close();
    this.loadUserData(); 
  }

  private loadUserData() {
    const usuarioStr = localStorage.getItem('usuario');
    const rolStr = localStorage.getItem('rol'); 

    if (usuarioStr) {
      try {
        const usuario = JSON.parse(usuarioStr);

        this.http.get<any>(`${this.apiUrl}/${usuario.id}`).subscribe({
          next: (usuarioDb) => {
            if (usuarioDb && usuarioDb.usuario && usuarioDb.rol) {
              this.nombre = usuarioDb.usuario; 
              const rol = usuarioDb.rol;
              this.idCarrera = usuarioDb.IDcarrera || null; // Obtener IDcarrera

              this.isTeacher = rol === 'profesor';
              this.isStudent = rol === 'estudiante';

              // Verifica si el rol en localStorage es diferente del rol en la API
              if (rolStr !== rol) {
                window.location.reload(); 
              }
            } else {
              this.handleMissingUserInfo();
            }
          },
          error: (err) => {
            console.error('Error al obtener el usuario de db.json:', err);
            this.handleMissingUserInfo();
          }
        });
      } catch (error) {
        this.handleMissingUserInfo();
      }
    } else {
      this.handleMissingUserInfo();
    }
  }

  private handleMissingUserInfo() {
    this.nombre = 'Usuario';
    this.isTeacher = false;
    this.isStudent = false;
    this.idCarrera = null; // Resetear IDcarrera
  }

  cerrarSesion() {
    localStorage.clear();
    this.resetUserData(); 
    this.router.navigate(['/login']);
  }

  private resetUserData() {
    this.nombre = 'Usuario';
    this.isTeacher = false;
    this.isStudent = false;
    this.idCarrera = null; // Resetear IDcarrera
  }

  verMisClases() {
    if (this.isTeacher) {
      this.router.navigate(['/mis-clases']);
    }
  }

  registrarAsistencia() {
    if (this.isTeacher) {
      this.router.navigate(['/reg-asistenciaP']);
    }
  }

  // Métodos exclusivos para el estudiante
  verMisNotas() {
    if (this.isStudent) {
      this.router.navigate(['/notas']);
    }
  }

  verMisAsignaturas() {
    if (this.isStudent) {
      this.router.navigate(['/asignaturas']);
    }
  }
}
