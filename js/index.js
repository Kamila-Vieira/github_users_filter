"use strict";
let listUserContainer = document.querySelector('#grid-user-container');
let userNames = [];
let allFilteredUsers = [];
let usersSearchedByName= [];
let filteredUsersByCreationDate = [];
let usersLocation = [];
let filteredUsersByLocation = [];
let filteredBios = [];

let orderUsersValue = '';
let orderLocationUsersValue = '';
let nameToSearch = '';
let hasBio = true;

let inputSearchUser;
let orderUsers;
let filterLocationUsers;
let filterBio;

//Evento inicial de carregamento
window.addEventListener("load", async () => {
  await fetchGithubUsers();
  getFilterElements();
  handlerFilterUsers();
});
//Função que seleciona os elementos de filtro para serem utilizados posteriormente
const getFilterElements = () => {
  inputSearchUser = document.querySelector('#input-search');
  orderUsers = document.querySelector('#order-users');
  filterLocationUsers = document.querySelector('#location-users');
  filterBio = document.querySelector('#input-filter-bio');
}
//Função que realização a requisição com a API
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
//Função que aciona os eventos de pesquisa
const handlerFilterUsers = () => {
  inputSearchUser.addEventListener("input", searchGithubUserByName);
  filterLocationUsers.addEventListener("change", filterGithubUserByLocation);
  orderUsers.addEventListener("change", filterGithubUserByCreationDate);
  filterBio.addEventListener("click", filterGithubUserByBio);
}
//Remove acentos e espaços da string
const createUserCard = (user) => {
  const {login, name, avatar_url, created_at, location, bio} = user;
  let userCardInit = "<li class='user-card'>";
  let userCard = 
    `<div id="${login}" class="user">
      <img src='${avatar_url}' alt="${name}" class="user-avatar">
      <p class="user-name">${name === null ? login : name}</p>
      <p class="user-date">${formatDate(new Date(created_at))}</p>
      <p class="user-location">${location === null ? 'Sem localização' : location}</p>
      <p class="user-bio">${bio === null ? 'Sem Bio' : bio}</p>
    </div>
    </li>`
  userCardInit += userCard;
  listUserContainer.innerHTML += userCardInit;
  createLocationOption(allFilteredUsers)
}
//Remove acentos e espaços da string
const removeAccentsAndSpaces = (name) => {
  return name.normalize("NFD").replace(/[^a-zA-Zs]/g, "");
}
//Formata a data para o padrão brasileiro
const formatDate = (date) => {
  return `${("00" + date.getDate()).slice(-2)}/${("00" + (date.getMonth() + 1)).slice(-2) }/${date.getFullYear()}`;
}
//Função que chama o filtro por nome
const searchGithubUserByName = (event) => {
  nameToSearch = removeAccentsAndSpaces(event.target.value);
  filterUsers();
}
//Função que chama o filtro por data
const filterGithubUserByCreationDate = (event) => {
  orderUsersValue = event.target.value;
  filterUsers();
}
//Função que chama o filtro por localização
const filterGithubUserByLocation = (event) => {
  orderLocationUsersValue = event.target.value;
  filterUsers();
}
//Função que chama o filtro por usuários com ou sem bio
const filterGithubUserByBio = () => {
  !hasBio ? hasBio = true : hasBio = false;
  filterUsers();
}
//Permite o filtro de usuários sobre outros filtros ou nenhum filtro
const filterUsers = () => {
  listUserContainer.innerHTML = ''
  //Busca de usuários pelo nome ou login (caso não tenha nome)
  usersSearchedByName = allFilteredUsers
  .filter(user => {
      const { login, name } = user;
      let nameToFilter;
      name === null ? nameToFilter = login : nameToFilter = name;
      return nameToFilter.toLowerCase().includes(nameToSearch)
    });
  //Filtra usuários pela data
  filteredUsersByCreationDate = (orderUsersValue === 'old-users'
    ? usersSearchedByName.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    : usersSearchedByName.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
  //Filtra usuários pela localização
  filteredUsersByLocation = filteredUsersByCreationDate.filter(user => {
    let { location } = user
    location !== null ? location : location = 'Sem localização';
    return removeAccentsAndSpaces(location).includes(orderLocationUsersValue)
  });
  filteredBios = filteredUsersByLocation.filter(user => hasBio ? user.bio !== null : user.bio === null)
  filteredBios.map(user => createUserCard(user));
}
//Cria automaticamento opções de localização com base nas localizações disponíveis na API
const createLocationOption = (obj) => {
  filterLocationUsers.innerHTML = ''
  usersLocation = obj.map(user => user.location)
  let hiddenOption = `<option value="hidden-location" hidden>Local</option>`
  filterLocationUsers.innerHTML = hiddenOption;
  return usersLocation
    .filter((l, i) => usersLocation.indexOf(l) === i)
    .filter(location=> {
      location !== null ? location : location = 'Sem localização';
      let locationOption = `<option value="${removeAccentsAndSpaces(location)}">${location}</option>`
      return filterLocationUsers.innerHTML += locationOption;
  });
}