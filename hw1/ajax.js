class RepoList {

  constructor(url) {
    this._thenChain = [];
    this._catchChain = [];
    this._url = url;
  }

  then(fn) {
    this._thenChain.push(fn);
    return this;
  } //close then

  catch(fn) {
    this._catchChain.push(fn);
    return this;
  } //close catch

  get() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', this._url, true);

    xhr.addEventListener('readystatechange', () => { //instead of using function() and using arrow it stops rebinding `this`

      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status >= 200 && xhr.status < 300) {
          var data = JSON.parse(xhr.responseText);

          this._thenChain.forEach(function(callback) { //`.forEach` is new ES2015 method
            data = callback(data);
          });

        } else if (xhr.status >= 400) {
          var data = xhr.response;

          this._catchChain.each(function(callback) {
            var err = {
              code: xhr.status,
              body: xhr.responseText,
              message: xhr.statusText
            }

            this._catchChain.forEach(function(callback) {
              err = callback(err);
            });
          });

        }
      }
    }); //close xhr addEventListener

    xhr.send();

  } //close get

} //close class