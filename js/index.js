"use strict";

window.addEventListener("load", async () => {
  await fetchGithubUser('Kamila-Vieira');
});

const listUserContainer = document.querySelector('.grid-user-container');
const inputSearchUser = document.querySelector('.input-search-user');

window.addEventListener("input", async () => {
  await fetchGithubUser(inputSearchUser.value);
});

let githubUsers = [];
/* function searchGithubUser(user){
  return fetchGithubUser(user)
} */

const fetchGithubUser = async (user) =>{
  const response = await fetch(`https://api.github.com/users/${user}`);
  const json = await response.json().then(async data => await data);
  const { name, avatar_url, created_at, location} = json;
  return createUserCard(name, avatar_url, created_at, location)
}

function createUserCard(name, picture, created, location){
  const userCard = document.createElement('li');
  const userName = document.createElement('p');
  const userPicture = document.createElement('img');
  userPicture.setAttribute('src', picture)
  const userCreated = document.createElement('p');
  const userLocation = document.createElement('p');
  userCard.appendChild(userName);
  userCard.appendChild(userPicture);
  userCard.appendChild(userCreated);
  userCard.appendChild(userCreated);
  listUserContainer.appendChild(userCard);
  userName.textContent = name;
  userCreated.textContent = created;
  userLocation.textContent = location;
}



/* 
const fetchDevs = async () => {
  const res = await fetch("http://localhost:3001/devs");
  const json = await res.json();
  allDevs = json.map((dev) => {
    const { id, name, picture, programmingLanguages } = dev;
    const nameLowerCase = name.toLowerCase();
    const nameToSearch = removeAccentsAndSpaces(nameLowerCase);
    return {
      id,
      name,
      nameToSearch,
      picture,
      programmingLanguages,
    };
  });
} */