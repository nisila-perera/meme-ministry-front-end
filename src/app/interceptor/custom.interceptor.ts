import { HttpInterceptorFn } from '@angular/common/http';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  
  const PUBLIC_URLS = ['/login', '/register'];

  const isPublicUrl = PUBLIC_URLS.some(url => req.url.includes(url));
  
  if (isPublicUrl || !token) {
    return next(req);
  }

  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return next(clonedRequest);
};