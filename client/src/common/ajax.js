export default class Ajax {
  static config = {
    apiUrl: '',
    bearerToken: ''
  };

  request(method, url, data, withCredentials = true) {
      var dataJson;
      if (typeof data !== 'undefined' && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
        dataJson = JSON.stringify(data);
      }

      url = (Ajax.config.apiUrl || '') + url;

      var promise = new Promise( function (resolve, reject) {

        var xhr = new XMLHttpRequest();

        xhr.withCredentials = withCredentials;

        xhr.open(method, url);

        if (Ajax.config.bearerToken){
          xhr.setRequestHeader('authorization', `Bearer ${Ajax.config.bearerToken}`);
        }

        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.send(dataJson);

        xhr.onload = function () {
          if (this.status >= 200 && this.status < 300) {
            var respData = this.response && JSON.parse(this.response) || this.response;
            resolve(respData);
          } else {
            reject(this.status, this.statusText, this.response);
          }
        };
        xhr.onerror = function () {
          reject(this.status, this.statusText, this.response);
        };
      });

      return promise;
  }

  get(url, data, withCredentials = true){
    var typeOfData = typeof data;
    if (typeOfData !== 'undefined'){
      var args =
        typeOfData === 'string'
          ? data
          : Object.keys(data)
            .map(function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) })
            .join('&');

      url +='?' + args;
    }

    return this.request('GET', url, withCredentials);
  }

  post(url, data, withCredentials = true){
    return this.request('POST', url, data, withCredentials);
  }

  put(url,data, withCredentials = true){
    return this.request('PUT', url, data, withCredentials);
  }

  delete(url,data, withCredentials = true){
    return this.request('DELETE', url, data, withCredentials);
  }
}

export const ajax = new Ajax();

export function ajaxConfig(config) {
  Object.assign(Ajax.config, config);
}
