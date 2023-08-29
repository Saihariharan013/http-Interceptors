import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ApiService } from './http/api.service';
import { LoadingService } from './http/loading.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public data: any;

  constructor(private api: ApiService, public loading: LoadingService) {
    this.getData();
    this.status(200);
  }

  public getData() {
    this.data = [];

    // HttpHeaders
    let headers = null;
    // headers = new HttpHeaders().set('Content-Type', 'application/json').set('Api-Key', 'xxx');

    const query = {
      description: 'help ',
      Auth: 'OAuth',
    };

    this.api
      .get('https://api.publicapis.org/entries', query, headers) // Get Request?
      .subscribe(
        (res) => (this.data = res),
        (err) => this.api.messageErrors(err) // Error Handling mot request?
      );
  }

  public status(code: string | number) {
    this.api.get('https://httpstat.us/' + code).subscribe(
      (res) => console.log('httpstat.us: ', res),
      (err) => this.api.messageErrors(err) // Error Handling mot request?
    );
  }
}
