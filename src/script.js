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
    anchor.textContent = text; // append the text as a text node
    return anchor; // return the assembled <a> custom element
  },
  // table(): returns a custom <table> element with optional header and/or rows
  table: (header, rows) => {
    const table = document.createElement('table'); // create a new <table> element
    table.className = 'pr-table'; // set the class name as 'pr-table'
    if (header) { // if a header array has been provided...
      table.appendChild(createCustomElement.trh(...header)); // ...append it as a custom <th> element
    }
    rows.forEach((row) => { // if an array of line arrays has been provided...
      table.appendChild(createCustomElement.trd(...row)); // ...append each line as a custom <tr> element
    });
    return table; // return the assembled <table> custom element
  },
  // td(contents): returns a custom <td> element with the provided text content
  td: (contents) => {
    const td = document.createElement('td'); // create a new <td> element
    td.className = 'pr-cell'; // set the class name as 'pr-cell'
    if (typeof contents === 'object') {
      td.appendChild(contents); // if contents is an object, append it as a child
    } else {
      td.innerHTML = contents; // if it's not, set it as the text content
    }
    return td; // return the assembled <td> custom element
  },
  // th(contents): returns a custom <th> element with the provided text content
  th: (contents) => {
    const th = document.createElement('th'); // create a new <th> element
    th.className = 'pr-header'; // set the class name as 'pr-header'
    if (typeof contents === 'object') {
      th.appendChild(contents); // if contents is an object, append it as a child
    } else {
      th.innerHTML = contents; // if it's not, set it as the text content
    }
    return th; // return the assembled <td> custom element
  },
  // trd(...tds): returns a custom <tr> element with the given <td>'s
  trd: (...tds) => {
    const trd = document.createElement('tr'); // create a new <tr> element
    trd.className = 'pr-line'; // set the class name as 'pr-line'
    tds.forEach((td) => trd.appendChild(createCustomElement.td(td))); // append all cells as custom <td> elements
    return trd; // return the assembled <tr> custom element
  },
  // trh(...ths): returns a custom <tr> element with the given <th>'s
  trh: (...ths) => {
    const trh = document.createElement('tr'); // create a new <tr> element
    trh.className = 'pr-header'; // set the class name as 'pr-line'
    trh.setAttribute('data-toggle', 'collapse');
    trh.setAttribute('data-target', '.pr-line');
    ths.forEach((th) => trh.appendChild(createCustomElement.th(th))); // append all headers as custom <th> elements
    return trh; // return the assembled <tr> custom element
  },
};

// addUser(): reads the .user_input text input and adds a custom hyperlink to the user's GitHub profile
async function addUser() {
  const user = selector.user_input.value;
  if (!user || user.length === 0) {
    return;
  }
  const JSON = await api.query(`/users/${user}`);
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
  const criteria = splitOutput(splited, 'Critério de Avaliação');
  const mandatoryReqs = splitOutput(splited, 'requisitos obrigatórios');
  const totalReqs = splitOutput(splited, 'requisitos totais');

  return { status, criteria, mandatoryReqs, totalReqs };
}

async function getRepoInfo(cohort, project) {
  const baseQuery = `/repos/{org}/${cohort}-project-${project}`; // create base query from cohort and project
  const pullRequestsJSON = await api.query(`${baseQuery}/pulls?per_page=100`); // get list of PR's from the GitHub API
  
  const values = pullRequestsJSON.map(async (element) => { // for each PR...
    const { number, user } = element;
    const comments = await api.query(`${baseQuery}/issues/${number}/comments?per_page=100`);
    const comment = comments.reverse().find((c) => c.body.includes('Resultado do projeto')).body;
    const line = getProjectStatus(comment);
    line.number = number;
    line.user = createCustomElement.a(user.html_url, user.login);
    return line;
  });
  const result = await Promise.all(values);
  return result;
}

async function getRepo() {
  // const cohort = selector.cohort.value; // get cohort name from the the #cohort select
  // const project = selector.repos_input.value; // get project name from the #repos_input input
  const cohort = 'sd-014-a';
  const project = 'pixels-art';

  const results = await getRepoInfo(cohort, project);
  results.sort((a, b) => Number(a.number) - Number(b.number));

  const table = document.createElement('table'); // create a new <table> element
  table.className = 'pr-table'; // set the class name as 'pr-table'
  const header = ['Número', 'Usuário', 'Desempenho', 'Critério', 'Reqs. Obrigs.', 'Reqs. Totais']; // define a header...
  table.appendChild(createCustomElement.trh(...header)); // ...and append it as a custom <tr> of <th> elements
  results.forEach((result) => { // for each PR...
      const { number, user, status, criteria, mandatoryReqs, totalReqs } = result; // ...destructure from the object...
      table.appendChild(createCustomElement.trd(
        number,
        user,
        status,
        criteria,
        mandatoryReqs,
        totalReqs,
      )); // ...and append each line as a custom <tr> of <td> elements
    });
  selector.output.appendChild(table); // append the assembled table as a child of #output
}

// element initialization on page load
window.onload = () => {
  // load DOM selectors
  selector.add(
    'user_button',
    'user_input',
    'repos_button',
    'repos_input',
    'cohort',
    'output',
  );
  // add event listeners
  selector.user_button.addEventListener('click', addUser);
  selector.repos_button.addEventListener('click', getRepo);
};

// export objects for testing
export { createCustomElement, selector };
