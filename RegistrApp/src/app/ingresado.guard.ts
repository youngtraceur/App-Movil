import { CanActivateFn, Router } from '@angular/router';

export const ingresadoGuard: CanActivateFn = (route, state) => {
  const rolGuardado = localStorage.getItem('rol');

  // Verifica si el usuario y el rol están almacenados en localStorage
  if (rolGuardado) {
    console.log('Acceso permitido:', rolGuardado);
    return true; // Permitir el acceso si el usuario y rol existen
  } else {
    console.log('Acceso denegado');
    
    // Redirecciona a la página de ingreso
    const router = new Router();
    router.navigate(['/ingresar']);
    
    return false; // Denegar el acceso si no hay usuario o rol
  }
};
