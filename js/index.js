"use strict";
let searchedByNameUsers = [];
let orderedUsers = [];
let searchedByLocationUsers = [];
let filteredBios = [];
let filteredUsers = [];
let filteredUsersArray = [];

let usersNames = [];
let inputSearchUser;
let orderUsers;
let filterLocationUsers;
let filterBio;
let nameToSearch;

let userCard;
let listUserContainer;

window.addEventListener("load", async () => {
  getFilterElements()
  await fetchGithubUsers();
  window.addEventListener("input", searchGithubUserByName);
});

const getFilterElements = () => {
  inputSearchUser = document.querySelector('#input-search');
  orderUsers = document.querySelector('#order-users');
  filterLocationUsers = document.querySelector('#location-users');
  filterBio = document.querySelector('#input-filter-bio');
}

const fetchGithubUsers = async () =>{
  const URL = `https://api.github.com/users`
  const response = await fetch(URL);
  //http://localhost:3000/users
  const json = await response.json()
    .then(async data => await data)
    .catch(err => console.log(err));
    
    json.map(username => {
      const { login } = username;
      return usersNames.push(login);
    });

    usersNames.map(async user => {
      const res = await fetch(`${URL}/${user}`);
      let json = await res.json()
        .then(async data => await data)
        .catch(err => console.log(err));
      filteredUsers.push(json);
      return createUserCard(json)
      
    })
  }
  
  const createUserCard = (user) => {
    const {login, name, avatar_url, created_at, location, bio} = user;
    listUserContainer = document.querySelector('.grid-user-container')
    let cardFiltered = document.getElementById(login);
    if(cardFiltered === null){
      const userData = {
        picture: document.createElement('img'),
        name: document.createElement('p'),
        creationDate: document.createElement('p'),
        location: document.createElement('p'),
        bio: document.createElement('p')
      }
      userCard = document.createElement('li');
      for (const data in userData) {
        userCard.appendChild(userData[data])
      }
      userCard.setAttribute('id', login)
      userData.picture.setAttribute('src', avatar_url)
      userData.name.textContent = name;
      userData.creationDate.textContent = created_at;
      userData.location.textContent = location;
      userData.bio.textContent = bio;
      listUserContainer.appendChild(userCard);
    }
    if(cardFiltered !== null){
      listUserContainer.removeChild(cardFiltered);
    }
}

const removeAccentsAndSpaces = (nameToSearch) => {
  return nameToSearch.normalize("NFD").replace(/[^a-zA-Zs]/g, "");
}

const searchGithubUserByName = (event) => {
  nameToSearch = removeAccentsAndSpaces(event.target.value);
  filterUsers()
}

const filterUsers = () => {
  let filtered = []
  filtered = filteredUsers.filter(user => user.login.includes(nameToSearch));
  return filtered.map(itm => createUserCard(itm))
}