import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiService } from './api.service';
import { InterceptorService } from './interceptor.service';
import { LoadingService } from './loading.service';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [
    ApiService,
    LoadingService,
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: InterceptorService, 
      multi: true 
    },
  ],
})
export class HttpModule {}
