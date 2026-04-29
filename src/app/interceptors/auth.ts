import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // En una app real, el token vendría de un AuthService o localStorage
    const token = 'fake-jwt-token-for-demo';

    // Las requests son inmutables — hay que clonar y modificar
    const authReq = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    });

    return next(authReq);
};
