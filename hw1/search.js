class Search {

  constructor() {
    this._searchfield = document.getElementById('js-search');
  }

  render() {
    return this._searchfield;
  }

  on(name) {
    var filter = '';
    var list = document.getElementsByTagName('li');

    this._searchfield.addEventListener(name, function(e) {

      if( e.keyCode == 8) { //delete btn pressed
        filter = filter.substring(0, filter.length - 1);
      } else {
        filter += String.fromCharCode(e.keyCode).toLowerCase();
      }

      //do the filtering
      for (var i=0; i < list.length; i++) {
        if (list[i].textContent.indexOf(filter) == -1) {
          list[i].style.display = 'none';
        } else {
          list[i].style.display = 'block';
        }
      }

    });
  }


} //close class