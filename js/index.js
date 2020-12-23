"use strict";
let searchedByNameUsers = [];
let orderedUsers = [];
let searchedByLocationUsers = [];
let filteredBios = [];
let filteredNames = [];
let usersNames = [];
let inputSearchUser;
let orderUsers;
let filterLocationUsers;
let filterBio;
let nameToSearch;


window.addEventListener("load", async () => {
  getFilterElements()
  await fetchAllGithubUsers();
  window.addEventListener("input", searchGithubUserByName);
});

const getFilterElements = () => {
  inputSearchUser = document.querySelector('#input-search');
  orderUsers = document.querySelector('#order-users');
  filterLocationUsers = document.querySelector('#location-users');
  filterBio = document.querySelector('#input-filter-bio');
}

const fetchAllGithubUsers = async () =>{
  const URL = `https://api.github.com/users`
  const response = await fetch(URL);
  const json = await response.json().then(async data => await data);
  
  return json.map(user => {
    const { login } = user;
    return usersNames.push(login);
  })
}

const fetchGithubUserData = async (user) =>{
  const response = await fetch(`https://api.github.com/users/${user}`);
  const json = await response.json().then(async data => await data);
  const { name, avatar_url, created_at, location, bio} = json;
  return createUserCard(name, avatar_url, created_at, location, bio);
}

const createUserCard = (name, picture, created, location, bio) => {
  const listUserContainer = document.querySelector('.grid-user-container');
  const userCard = document.createElement('li');
  const newUser = {
    picture: document.createElement('img'),
    name: document.createElement('p'),
    creationDate: document.createElement('p'),
    location: document.createElement('p'),
    bio: document.createElement('p')
  }
  for (const data in newUser) {
    userCard.appendChild(newUser[data])
  }
  newUser.picture.setAttribute('src', picture)
  newUser.name.textContent = name;
  newUser.creationDate.textContent = created;
  newUser.location.textContent = location;
  newUser.bio.textContent = bio;
  listUserContainer.appendChild(userCard);
}

const removeAccentsAndSpaces = (nameToSearch) => {
  return nameToSearch.normalize("NFD").replace(/[^a-zA-Zs]/g, "");
}


const searchGithubUserByName = (event) => {
  nameToSearch = removeAccentsAndSpaces(event.target.value);
  filterUsers();
}

const filterUsers = () => {
  filteredNames = usersNames.filter(name => name.includes(nameToSearch));
  return filteredNames.map(name => fetchGithubUserData(name));
}
console.log(filteredNames)