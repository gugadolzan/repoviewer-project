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
  const pullRequestsJSON = await api.query(
    `repos/tryber/${cohort}-project-${project}/pulls`
    // expect all PRs
  );

  pullRequestsJSON.forEach(async ({ number, user, comments_url }) => {
    const prNumber = number;
    const name = user.login;

    const commentJSON = await api.query(comments_url);
    // Arrumar o parâmetro query!!!
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
  // set the GitHub API base URL
  api.baseURL = 'https://api.github.com/';
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
  selector.repos_button.addEventListener('click', appendRepos);
};

export { createCustomElement, selector };
