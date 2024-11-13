import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-asignaturas',
  templateUrl: './asignaturas.page.html',
  styleUrls: ['./asignaturas.page.scss'],
})
export class AsignaturasPage implements OnInit {
  asignaturas: any[] = []; // Array para almacenar las asignaturas
  idCarrera: number = 0; // Variable para almacenar el ID de carrera

  private apiUrl = 'http://localhost:3000/asignaturas'; 

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.idCarrera = this.getCarreraId(); 
    this.loadAsignaturas(); 
  }

  private loadAsignaturas() {
    this.getAsignaturasPorCarrera(this.idCarrera).subscribe({
      next: (asignaturas) => {
        this.asignaturas = asignaturas; 
      },
      error: (err) => {
        console.error('Error al cargar las asignaturas:', err);
      },
    });
  }

  private getCarreraId(): number {
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);
      return usuario.IDcarrera || 0; 
    }
    return 0; 
  }

  private getAsignaturasPorCarrera(idCarrera: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?IDcarrera=${idCarrera}`); 
  }

  saveAsignaturaId(idAsignatura: number) {
    localStorage.setItem('IDasignatura', idAsignatura.toString());
    console.log('IDasignatura guardado en localStorage:', idAsignatura);
  }
}
