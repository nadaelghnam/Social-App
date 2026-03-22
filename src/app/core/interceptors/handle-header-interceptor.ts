import { HttpInterceptorFn } from '@angular/common/http';

export const handleHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  // req
  if (localStorage.getItem("userToken")) {
    req = req.clone({
      setHeaders: {
        token: localStorage.getItem("userToken") as string
      }

    })
  }

    return next(req) //res;
  };
