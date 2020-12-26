"use strict";
//Definição das variáveis
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
let hasBio;

let listUserContainer;
let inputSearchUser;
let orderUsers;
let filterLocationUsers;
let filterBio;

//Evento inicial de carregamento
window.addEventListener("load", async () => {
  await fetchGithubUsers();
  getFilterElements();
  inputSearchUser.focus()
  handlerFilterUsers();
});
//Função que seleciona os elementos de filtro para serem utilizados posteriormente
const getFilterElements = () => {
  listUserContainer = document.querySelector('#grid-user-container');
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
//Cria o card de cada usuário
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
  createLocationOption(allFilteredUsers);
}
//Remove acentos e espaços da string
const removeAccentsAndSpacesLowerCase = (name) => {
  return name.normalize("NFD").replace(/[^a-zA-Zs]/g, "").toLowerCase();
}
//Formata a data para o padrão brasileiro
const formatDate = (date) => {
  return `${("00" + date.getDate()).slice(-2)}/${("00" + (date.getMonth() + 1)).slice(-2) }/${date.getFullYear()}`;
}
//Função que chama o filtro por nome
const searchGithubUserByName = (event) => {
  nameToSearch = removeAccentsAndSpacesLowerCase(event.target.value);
  filterUsers();
}
//Função que chama o filtro por data
const filterGithubUserByCreationDate = (event) => {
  orderUsersValue = event.target.value;
  filterUsers();
}
//Função que chama o filtro por localização
const filterGithubUserByLocation = (event) => {
  orderLocationUsersValue = removeAccentsAndSpacesLowerCase(event.target.value);
  filterUsers();
}
//Função que chama o filtro por usuários com ou sem bio
const filterGithubUserByBio = () => {
  hasBio ? hasBio = false : hasBio = true;
  filterUsers();
}
//Permite o filtro de usuários sobre outros filtros ou nenhum filtro
const filterUsers = () => {
  listUserContainer.innerHTML = '';
  //Busca de usuários pelo nome ou login (caso não tenha nome)
  usersSearchedByName = allFilteredUsers
  .filter(user => {
      const { login, name } = user;
      let nameToFilter;
      name === null ? nameToFilter = login : nameToFilter = name;
      return removeAccentsAndSpacesLowerCase(nameToFilter)
        .includes(nameToSearch)
    });
    console.log(usersSearchedByName)
  //Filtra usuários pela data
  switch (orderUsersValue) {
    case 'old-users':
      filteredUsersByCreationDate = usersSearchedByName
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      break;
    case 'new-users':
      filteredUsersByCreationDate = usersSearchedByName
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      break;
    default:
      filteredUsersByCreationDate = usersSearchedByName;
      break;
  }
  //Filtra usuários pela localização
  if(orderLocationUsersValue !== 'todos'){
    filteredUsersByLocation = filteredUsersByCreationDate.filter(user => {
      let { location } = user
      location !== null ? location : location = 'Sem localização';
      return removeAccentsAndSpacesLowerCase(location)
        .includes(orderLocationUsersValue)
    });
  }else{
    filteredUsersByLocation = filteredUsersByCreationDate;
  }
  filteredBios = filteredUsersByLocation
    .filter(user => hasBio ? user.bio !== null : user.bio === null)
    .map(user => createUserCard(user));
}
//Cria automaticamento opções de localização para o filtro de local com base nas disponíveis na API
const createLocationOption = (users) => {
  filterLocationUsers.innerHTML = '';
  usersLocation = users.map(user => user.location);
  let hiddenOption = `<option class="location-option" value="hidden-location" hidden>Local</option>`
  filterLocationUsers.innerHTML = hiddenOption;
  usersLocation.unshift('Todos');
  return usersLocation
    .filter((l, i) => usersLocation.indexOf(l) === i)
    .filter(location=> {
      location !== null ? location : location = 'Sem localização';
      let locationOption = `<option class="location-option" value="${removeAccentsAndSpacesLowerCase(location)}">${location}</option>`
      return filterLocationUsers.innerHTML += locationOption;
  });
}