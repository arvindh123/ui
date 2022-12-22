import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import 'rxjs/add/operator/switchMap';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { environment } from 'environments/environment';

const bearerSchemePrefix = 'Bearer ';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  loginUrl: string;

  constructor(
    private inj: Injector,
    private authService: NbAuthService,
    private router: Router,
  ) {
    this.loginUrl = environment.appPrefix === ''
                      ? environment.loginUrl
                      : '/' + environment.appPrefix + environment.loginUrl;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authService = this.inj.get(NbAuthService);

    return this.authService.getToken().pipe(switchMap(
      (token: NbAuthJWTToken) => {
        if (token && token.getValue() &&
          !request.url.startsWith(environment.httpAdapterUrl) &&
          !request.url.startsWith(environment.bootstrapUrl) &&
          !request.url.startsWith(environment.browseUrl)
        ) {
          let tokenValue = token.getValue();
          if (request.url.startsWith(environment.usersUrl)) {
            tokenValue = bearerSchemePrefix + tokenValue;
          }
          request = request.clone({
            setHeaders: {
              'Authorization': tokenValue,
            },
          });
        }
        return next.handle(request).pipe(tap(
          resp => {
          },
          err => {
            if (err instanceof HttpErrorResponse &&
              err.status === 403 || err.status === 401 &&
              !request.url.startsWith(environment.httpAdapterUrl) &&
              !request.url.startsWith(environment.readerUrl) &&
              !request.url.startsWith(environment.bootstrapUrl)) {
              localStorage.removeItem('auth_app_token');
              this.router.navigateByUrl(this.loginUrl);
            }
          },
        ));
      },
    ));
  }
}
