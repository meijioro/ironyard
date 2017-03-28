//grab list of repos
function callAjax() {
  new RepoList('repos.json')
  .then( result => {
    result.forEach(function(entry) {
      var li = document.createElement("li");
      li.innerHTML = '<a href="'+ entry.html_url + '">' + entry.full_name + '</a>';

      document.getElementById('js-list').appendChild(li);
    });
  })
  .catch(e => console.error(e))
  .get();
}

callAjax();


var search = new Search();
search.render();


search.on('keydown');