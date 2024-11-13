import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notas',
  templateUrl: './notas.page.html',
  styleUrls: ['./notas.page.scss'],
})
export class NotasPage implements OnInit {
  notas = [
    { asignatura: "Arquitectura", siglas: "ASY4131", seccion: "002D", nota1: "6.7", nota2: "4.6", nota3: "4.5", nota4: "6.5" },
    { asignatura: "Calidad de Software", siglas: "CSY4111", seccion: "002D", nota1: "6.5", nota2: "5.6", nota3: "3.5", nota4: "6.7" },
    { asignatura: "Estadística descriptiva", siglas: "MAT4140", seccion: "004D", nota1: "4.6", nota2: "5.8", nota3: "4.7", nota4: "5.6" },
    { asignatura: "Ética para el trabajo", siglas: "EAY4450", seccion: "002D", nota1: "5.6", nota2: "6.3", nota3: "5.3", nota4: "3.4" },
    { asignatura: "Programación De Aplicaciones Moviles", siglas: "PGY4121", seccion: "003D", nota1: "7.0", nota2: "5.9", nota3: "5.6", nota4: "2.4" },
  ]
  constructor() { }

  ngOnInit() {
  }

}
