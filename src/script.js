// GitHub API base URL
const baseURL = 'https://api.github.com/';

// object that stores DOM selectors
const selector = {
  add: (...ids) =>
    ids.forEach((id) => (selector[id] = document.getElementById(id))),
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
}

// addUser(): reads the .user_input text input and adds a custom hyperlink to the user's GitHub profile
async function addUser() {
  const user = selector.user_input.value;
  if (!user || user.length === 0) {
    return;
  }
  const JSON = await queryAPI(`${baseURL}users/${user}`);
  selector.output.appendChild(
    createCustomElement.a(JSON.html_url, `${JSON.login} (${JSON.name})`)
  );
}

// SUPERBIZA

const splitOutput = (comment, param) =>
  comment
    .find((item) => {
      return item.includes(param);
    })
    .split('|')[1]
    .trim();

function getProjectStatus(comment) {
  const splited = comment.split('\n');

  const status = splitOutput(splited, 'Desempenho');
  const requiredReqs = splitOutput(splited, 'requisitos obrigatórios');
  const totalReqs = splitOutput(splited, 'requisitos totais');

  return { status, requiredReqs, totalReqs };
}

async function getInfo(cohort, project) {
  const pullRequestsJSON = await queryAPI(
    `${baseURL}repos/tryber/${cohort}-project-${project}/pulls`
    // expect all PRs
  );

  pullRequestsJSON.forEach(async ({ number, user, comments_url }) => {
    const prNumber = number;
    const name = user.login;

    const commentJSON = await queryAPI(comments_url);
    const comment = commentJSON
      .reverse()
      .find((comment) => comment.body.includes('Resultado do projeto'))['body'];

    const { status, requiredReqs, totalReqs } = getProjectStatus(comment);

    // prNumber, name, status, requiredReqs, totalReqs
    // calls function that creates table
  });
}

// Testing results
// getInfo('sd-014-a', 'pixels-art');

// element initialization on page load
window.onload = () => {
  // load DOM selectors
  selector.add(
    'user_button',
    'user_input',
    'repos_button',
    'repos_input',
    'output'
  );
  // add event listeners
  selector.user_button.addEventListener('click', addUser);
  // selector.repos_button.addEventListener('click', appendRepos);
};
