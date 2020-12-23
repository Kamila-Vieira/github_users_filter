"use strict";
let listUserContainer = document.querySelector('#grid-user-container');
let allFilteredUsers = [];
let filterUsersByLocation = [];
let usersSearchedByName= [];
let filteredUsersByCreationDate = [];
let filteredBios = [];
let userNames = [];

let orderUsersValue = '';
let nameToSearch = '';

let inputSearchUser;
let orderUsers;
let filterLocationUsers;
let filterBio;
let userCard;

window.addEventListener("load", async () => {
  getFilterElements()
  await fetchGithubUsers();
  handleFilterUsers();
});

const getFilterElements = () => {
  inputSearchUser = document.querySelector('#input-search');
  orderUsers = document.querySelector('#order-users');
  filterLocationUsers = document.querySelector('#location-users');
  filterBio = document.querySelector('#input-filter-bio');
}

const handleFilterUsers = () => {
  window.addEventListener("input", searchGithubUserByName);
  window.addEventListener("change", filterGithubUserByCreationDate);
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
    return userNames.push(login);
  });
  
  userNames.map(async user => {
    const res = await fetch(`${URL}/${user}`);
    const userJson = await res.json()
    .then(async data => await data)
    .catch(err => console.log(err));
    allFilteredUsers.push(userJson);
    return createUserCard(userJson)
  });
}

const createUserCard = (user) => {
  const {login, name, avatar_url, created_at, location, bio} = user;
  let userCardInit = "<ul class='user-card'>";
  let userCard = 
    `<li id="${login}" class="user">
      <img src='${avatar_url}' alt="${name}" class="avatar">
      <p>${name}</p>
      <p>${created_at}</p>
      <p>${location}</p>
      <p>${bio}</p>
    </li>`
    userCardInit += userCard;
    listUserContainer.innerHTML += userCardInit;
}

const removeAccentsAndSpaces = (nameToSearch) => {
  return nameToSearch.normalize("NFD").replace(/[^a-zA-Zs]/g, "");
}

const formatDate = (date) => {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

const searchGithubUserByName = (event) => {
  listUserContainer.innerHTML = ''
  nameToSearch = removeAccentsAndSpaces(event.target.value);
  usersSearchedByName = allFilteredUsers
    .filter(user => user.name !== null 
      ? user.name.toLowerCase().includes(nameToSearch) 
      : user.login.includes(nameToSearch))
    .map(user => createUserCard(user));
}

const filterGithubUserByCreationDate = () => {
  orderUsersValue = orderUsers.value;
  filteredUsersByCreationDate = usersSearchedByName
    .sort((a, b) => a.created_at > b.created_at)
    .map(user => createUserCard(user));
}