"use strict";

window.addEventListener("load", async () => {
  await fetchAllGithubUsers();
  window.addEventListener("input", await searchGithubUser);
});


let githubUsers = [];
const listUserContainer = document.querySelector('.grid-user-container');
const inputSearchUser = document.querySelector('.input-search-user');

const fetchAllGithubUsers = async () =>{
  const URL = `https://api.github.com/users`
  const response = await fetch(URL);
  const json = await response.json().then(async data => await data);
  githubUsers = json.map(user => {
    const { login } = user;
    return fetchGithubUserData(login);
  })
  return githubUsers;
}

const fetchGithubUserData = async (user) =>{
  const response = await fetch(`https://api.github.com/users/${user}`);
  const json = await response.json().then(async data => await data);
  const { name, avatar_url, created_at, location, bio} = json;
  return createUserCard(name, avatar_url, created_at, location, bio)
}

function createUserCard(name, picture, created, location, bio){
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

const searchGithubUser = async () => {
  await fetchGithubUserData(inputSearchUser.value);
}

