import { api } from './api.js';

// object that stores DOM selectors
const selector = {
  add: (...ids) => ids.forEach((id) => { selector[id] = document.getElementById(id); }),
};

// createCustomElement: object that creates custom DOM elements
const createCustomElement = {
  // a(href, text): returns a custom <a> element with provided href and text parameters
  a: (href, text) => {
    const anchor = document.createElement('a'); // create a new <a> element
    anchor.setAttribute('href', href); // set the href attribute
    anchor.appendChild(document.createTextNode(text)); // append the text as a text node
    return anchor; // return the assembled <a> custom element
  },
  // table(): returns a custom <table> element with optional header and/or rows
  table: (th = null, ...trs) => {
    const table = document.createElement('table'); // create a new <table> element
    table.className = 'pr-table'; // set the class name as 'pr-table'
    if (th) { // if a header array has been provided...
      table.appendChild(createCustomElement.th(...th)); // ...append it as a custom <th> element
    }
    for (const tr of trs) { // if an array of line arrays has been provided...
      table.appendChild(createCustomElement.td(...tr)); // ...append each line as a custom <tr> element
    }
    return table; // return the assembled <table> custom element
  },
  // td(contents): returns a custom <td> element with the provided text content
  td: (contents) => {
    const td = document.createElement('td'); // create a new <td> element
    td.className = 'pr-cell'; // set the class name as 'pr-cell'
    td.textContent = contents; // set the text content
    return td; // return the assembled <td> custom element
  },
  // th(...tds): returns a custom <th> element with the given <td>'s
  th: (...tds) => {
    const th = document.createElement('th'); // create a new <th> element
    th.className = 'pr-header'; // set the class name as 'pr-header'
    tds.forEach((td) => th.appendChild(createCustomElement.td(td))); // append all cells as custom <td> elements
    return th; // return the assembled <th> custom element
  },
  // tr(...tds): returns a custom <tr> element with the given <td>'s
  tr: (...tds) => {
    const tr = document.createElement('tr'); // create a new <tr> element
    tr.className = 'pr-line'; // set the class name as 'pr-line'
    tds.forEach((td) => tr.appendChild(createCustomElement.td(td))); // append all cells as custom <td> elements
    return tr; // return the assembled <tr> custom element
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
    .find((item) => item.includes(param))
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
  const pullRequestsJSON = await api.query(`repos/tryber/${cohort}-project-${project}/pulls`);

  pullRequestsJSON.forEach(async ({ number, user, commentsUrl }) => {
    const prNumber = number;
    const name = user.login;
    console.log(commentsUrl);
    const commentJSON = await api.query(commentsUrl);
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
    'output',
  );
  // add event listeners
  selector.user_button.addEventListener('click', addUser);
  selector.repos_button.addEventListener('click', getInfo('sd-014-a', 'pixels-art'));
};

// export objects for testing
export { createCustomElement, selector };
