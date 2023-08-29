import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
  } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import {
    catchError,
    concatMap,
    delay,
    finalize,
    Observable,
    of,
    retryWhen,
    throwError,
  } from 'rxjs';
  import { ApiService } from './api.service';
  import { LoadingService } from './loading.service';
  
  @Injectable()
  export class InterceptorService implements HttpInterceptor {
    private retry = {
      count: 1, // Number of retry: 1
      delay: 1000, // Delay: 1000ms = 1sec
      status: [204, 408, 429, 500, 502, 503, 504], // Status: [408, 429, 500, 502, 503, 504]
    };
  
    constructor(private api: ApiService, private loading: LoadingService) {}
  
    intercept(
      request: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>> {
      const uniqueKey = request?.url + (Math.random() * 10);
      this.loading.on(uniqueKey);
  
      // SetHeaders "Authorization" token 
      const accessToken = localStorage.getItem('TOKEN_KEY');
      if (accessToken) {
        request = request.clone({
          setHeaders: { Authorization: `Bearer ${accessToken}` },
        });
      }
  
      // Interceptor handle error
      return next.handle(request).pipe(
        // Retry request 
        retryWhen((error) =>
          error.pipe(
            concatMap((err, count) => this.retryContent(err, count)),
            delay(this.retry.delay)
          )
        ),
        catchError((error) => {
          this.loading.off(uniqueKey);
          // If is true, Access Token Handle
          if (error instanceof HttpErrorResponse) {
            // 401 Unauthorized
           
            if (error.status === 401) {
             return throwError(error.status);
            } else {
             
              this.showErrorPage(error);
              return throwError(error);
            }
          }
        }),
        finalize(() => {
          this.loading.off(uniqueKey);
        })
      );
    }
  
    private retryContent(error: any, count: number): Observable<any> {
      if (
        count < this.retry.count &&
        this.retry.status.indexOf(error?.status) > -1
      ) {
        return of(error);
      }
      return throwError(error);
    }
  
    private showErrorPage(error: HttpErrorResponse): void {
      // List of unwanted system errors
      // 500: Internal Server Error
      // 501: Not Implemented
      // 502: Bad Gateway
      // 503: Service Unavailable
      // 504: Gateway Timeout
      // 505: HTTP Version Not Supported
      const status = [500, 501, 502, 503, 504, 505];
      // Check does exist
      const isShowError = status.indexOf(error?.status);
      if (isShowError > -1) {
        // Redirect to error page
        // window.location.replace(`/error?code=${error?.status}`);
        console.log(`Error ${error?.status}: Navigate: /error?code=${error?.status}`);
        alert(`Error ${error?.status}: Navigate: /error?code=${error?.status}`);
      }
    }
  }
  