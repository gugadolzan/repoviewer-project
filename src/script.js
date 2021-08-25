import { api } from './api';

// object that stores DOM selectors
const selector = {
  add: (...ids) => ids.forEach((id) => { selector[id] = document.getElementById(id); }),
};

// createCustomElement: object that creates custom DOM elements
const createCustomElement = {
  // a(href, text): returns a custom <a> element with provided href and text parameters
  a: (href, text) => {
    const anchor = document.createElement('a');
    anchor.setAttribute('href', href);
    anchor.appendChild(document.createTextNode(text));
    return anchor;
  },
  // td(contents): returns a custom <td> element with the provided text content
  td: (contents) => {
    const td = document.createElement('td');
    td.className = 'pr-cell';
    td.textContent = contents;
    return td;
  },
  // tr(...tds): returns a custom <tr> element with the given <td>'s
  tr: (...tds) => {
    const tr = document.createElement('tr');
    tr.className = 'pr-line';
    tds.forEach((td) => tr.appendChild(createCustomElement.td(td)));
    return tr;
  },
};

// addUser(): reads the .user_input text input and adds a custom hyperlink to the user's GitHub profile
async function addUser() {
  const user = selector.user_input.value;
  if (!user || user.length === 0) {
    return;
  }
  const JSON = await api.query(`users/${user}`);
  selector.output.appendChild(createCustomElement.a(JSON.html_url, `${JSON.login} (${JSON.name})`));
}

// Biza

function createRepoElement(user, project) {
  const repoElement = document.createElement('div');
  const repoUser = document.createElement('span');
  const repoProject = document.createElement('span');

  repoUser.innerText = user;
  repoProject.innerText = project;

  repoElement.appendChild(repoUser);
  repoElement.appendChild(repoProject);

  document.getElementById('output').appendChild(repoElement);
}

async function getRepos(cohort, project) {
  const JSON = await api.query(`repos/tryber/${cohort}-project-${project}/pulls`);
  if (JSON) return JSON;
}

async function appendRepos() {
  // const reposList = await getRepos(cohort, project);
  const reposList = await getRepos('sd-014-a', 'pixels-art');

  reposList.forEach((repo) => {
    createRepoElement(repo.user.login, repo.title);
    console.log(repo);
  });
}

// Biza

// element initialization on page load
window.onload = () => {
  // set the GitHub API base URL
  api.baseURL = 'https://api.github.com/';
  // load DOM selectors
  selector.add('user_button', 'user_input', 'repos_button', 'repos_input', 'output');
  // add event listeners
  selector.user_button.addEventListener('click', addUser);
  selector.repos_button.addEventListener('click', appendRepos);
};

export { createCustomElement, selector };
