import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';

import Ajax from './ajax';

class AjaxRx extends Ajax {
  get(url, data, withCredentials = true) {
    return Observable::fromPromise(super.get(url, data, withCredentials));
  }

  post(url, data, withCredentials = true) {
    return Observable::fromPromise(super.post(url, data, withCredentials));
  }

  put(url, data, withCredentials = true) {
    return Observable::fromPromise(super.put(url, data, withCredentials));
  }

  delete(url, data, withCredentials = true) {
    return Observable::fromPromise(super.delete(url, data, withCredentials));
  }
}

export const ajax = new AjaxRx();
