import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  // GET
  public get(url: string, query?: any | any[], option?: any): Observable<any> {
    let urlFinal = url;
    if (query) {
      urlFinal = url + '?' + this.buildQueryParam(query);
    }
    return this.httpClient.get(urlFinal, { headers: option });
  }

  // POST
  public post(url: string, body: any, option?: any): Observable<any> {
    return this.httpClient.post(url, this.getTrimmedData(body), {
      headers: option,
    });
  }

  // PUT
  public put(url: string, body: any, option?: any): Observable<any> {
    return this.httpClient.put(url, this.getTrimmedData(body), {
      headers: option,
    });
  }

  // PATH
  public patch(url: string, body: any, option?: any): Observable<any> {
    return this.httpClient.patch(url, body, { headers: option });
  }

  // DELETE
  public delete(url: string, option?: any): Observable<any> {
    return this.httpClient.delete(url, { headers: option });
  }

  /**
   * BUILD QUERY method GET
   * HttpParams
   * NOTE: query.set(k, params[k]); 
   * NOTE: query.append(k, params[k]); 
   */
  public buildQueryParam(params: any | any[]) {
    let query = new HttpParams();
    if (params instanceof Array) {
      for (let param of params) {
        for (let k in param) {
          query = query.append(k, param[k]);
        }
      }
    } else if (params instanceof Object) {
      for (let k in this.removeEmpty(params)) {
        query = query.append(k, params[k]);
      }
    }
    return query.toString();

    // JS buildQueryParam with reduce
    // function StringifyQueryParam(queryParam = {}) {
    //   return Object.entries(queryParam)
    //     .reduce(
    //       (t, v) => `${t}${v[0]}=${encodeURIComponent(v[1])}&`,
    //       Object.keys(queryParam).length ? "?" : ""
    //     )
    //     .replace(/&$/, "");
    // }
    
    // const queryString = StringifyQueryParam({
    //   name: "bytefer",
    //   email: "bytefer@gmail.com",
    // });
    // // queryString: '?name=Bytefer&email=bytefer%40gmail.com'

    // JS parseQueryParam with reduce
    // function ParseQueryString(queryString) {
    //   return queryString
    //     .replace(/(^\?)|(&$)/g, "")
    //     .split("&")
    //     .reduce((t, v) => {
    //       const [key, val] = v.split("=");
    //       t[key] = decodeURIComponent(val);
    //       return t;
    //     }, {});
    // }
    // const queryParam = ParseQueryString("?name=Bytefer&email=bytefer%40gmail.com");
    // // queryParam: { name: 'Bytefer', email: 'bytefer@gmail.com' }
  }

  public messageErrors(error: number) {
    // TODO something
    console.log(error);
    // alert(JSON.stringify(err));

    if (error === 401) {
      alert(`Error: ${error} some error happens!`);
    }
  }

  // TRIM() payload
  private getTrimmedData(obj:any) {
    if (obj && !(obj instanceof FormData)) {
      if (obj && typeof obj === 'object') {
        Object.keys(obj).map((key) => {
          if (typeof obj[key] === 'object') {
            this.getTrimmedData(obj[key]);
          } else if (typeof obj[key] === 'string') {
            obj[key] = obj[key].trim();
          }
        });
      }
    }
    return obj;
  }

  // Remove field if null
  private removeEmpty(obj: { [x: string]: any; }) {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj;
  }
}
