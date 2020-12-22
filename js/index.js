var div = document.querySelector('.grid');
var xhr = new XMLHttpRequest();

var data = new Object();
async function fetchAllGithubUsers(user){
  var URL = `https://api.github.com/users/${user}`
  return await fetch(URL)
  .then(async response => await response.json()) 
  .then(json => json)
  .catch(err => console.log(err));
}
console.log(fetchAllGithubUsers('Kamila-Vieira').login)

