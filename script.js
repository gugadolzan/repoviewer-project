// GitHub API base URL
const baseURL = 'https://api.github.com/';

// object that stores DOM selectors
const selector = {
  add: (...ids) => ids.forEach((id) => selector[id] = document.getElementById(id)),
};

// errorMsg: output a formatted error message to the screen
const errorMsg = (msg) => alert(`[Error] ${msg}`);

// createCustomAnchorElement: object that creates custom DOM elements
const createCustomElement = {
  // a(href, text): returns a custom <a> element with provided href and text parameters
  a: (href, text) => {
    const anchor = document.createElement('a');
    anchor.setAttribute('href', href);
    anchor.appendChild(document.createTextNode(text));
    return anchor;
  },
};

// queryAPI(query): queries the GitHub API and returns the response as a JSON-formatted object
async function queryAPI(query) {
  try {
    const responseRaw = await fetch(query);
    const responseJSON = await responseRaw.json();
    if (responseJSON.message === 'Not Found') {
      throw `User ${user} not found!`;
    }
    return responseJSON;
  } catch (error) {
    errorMsg(error);
    return null;
  }
};

async function getUser(userID) {

}

// addUser(): reads the .user_input text input and adds a custom hyperlink to the user's GitHub profile
async function addUser() {
  const user = selector.user_input.value;
  if (!user || user.length === 0) {
    return;
  }
  const JSON = await queryAPI(`${baseURL}users/${user}`);
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
  const responseRaw = await fetch(`https://api.github.com/repos/tryber/${cohort}-project-${project}/pulls`);
  const responseJSON = await responseRaw.json();

  if (responseJSON) return responseJSON;
}

async function appendRepos(cohort, project) {
  // const reposList = await getRepos(cohort, project);
  const reposList = await getRepos('sd-014-a', 'pixels-art');

  reposList.forEach((repo) => {
    // createRepoElement()
    console.log(repo);
  });
}

// Biza

// element initialization on page load
window.onload = () => {
  // load DOM selectors
  selector.add('add_button', 'user_input', 'output');
  // add event listenersszs
  selector.add_button.addEventListener('click', addUser);

  console.log(selector);
}
