import api from './api.js';
import createCustomElement from './createCustomElement.js';
import storage from './storage.js';
import data from './data.js';

// object that stores DOM selectors
const selector = {
  add: (...ids) =>
    ids.forEach((id) => {
      selector[id] = document.getElementById(id);
    }),
};

// addUser(): reads the .user_input text input and adds a custom hyperlink to the user's GitHub profile
async function addUser() {
  const user = selector.user_input.value;
  if (!user || user.length === 0) {
    return;
  }
  const JSON = await api.query(`/users/${user}`);
  selector.output.appendChild(
    createCustomElement.a(JSON.html_url, `${JSON.login} (${JSON.name})`)
  );
}

// getProjectStatus: parses a comment string and returns status, criteria, mandatoryReqs, totalReqs
function getProjectStatus(comment) {
  const splitOutput = (txt, param) =>
    txt
      .find((item) => item.includes(param))
      .split('|')[1]
      .trim();

  const splitted = comment.split('\n');
  const status = splitOutput(splitted, 'Desempenho');
  const criteria = splitOutput(splitted, 'Critério de Avaliação');
  const mandatoryReqs = splitOutput(splitted, 'requisitos obrigatórios');
  const totalReqs = splitOutput(splitted, 'requisitos totais');

  return [status, criteria, mandatoryReqs, totalReqs];
}

/* // getRepoInfo: returns an array with grades info from all PR's in a repo
async function getRepoInfo(cohort, project) {
  const baseQuery = `/repos/{org}/${cohort}-project-${project}`; // create base query from cohort and project
  const pullRequestsJSON = await api.query(`${baseQuery}/pulls?per_page=100`); // get list of PR's from the GitHub API
  
  const values = pullRequestsJSON.map(async (element) => { // for each PR...
    const { number, user } = element; // get the PR number and user info
    const comments = await api.query(`${baseQuery}/issues/${number}/comments?per_page=100`); // call the API to get the comments
    const comment = comments.reverse().find((c) => c.body.includes('Resultado do projeto')).body; // look for the 'grades' comment
    return [number, createCustomElement.a(user.html_url, user.login), ...getProjectStatus(comment)]; // parse the info from the comment and return thre results
  });
  const results = await Promise.all(values); // call Promises.all to fullfill all promises
  return results; // return the fullfilled array
} */

// getRepo: reads user input and prints a table with grade information from a repo
async function getRepo(cohort, project) {
  const loading = createCustomElement.span('loading', `Loading ${project}...`);
  selector.output.appendChild(loading);

  const baseQuery = `/repos/{org}/${cohort}-project-${project}`; // create base query from cohort and project
  const pullRequestsJSON = await api.query(`${baseQuery}/pulls?per_page=100`); // get list of PR's from the GitHub API

  const values = pullRequestsJSON.map(async (element) => {
    // for each PR...
    const { number, user } = element; // get the PR number and user info
    const comments = await api.query(
      `${baseQuery}/issues/${number}/comments?per_page=100`
    ); // call the API to get the comments
    const comment = comments
      .reverse()
      .find((c) => c.body.includes('Resultado do projeto')).body; // look for the 'grades' comment
    return [
      number,
      createCustomElement.a(user.html_url, user.login),
      ...getProjectStatus(comment),
    ]; // parse the info from the comment and return thre results
  });
  const results = await Promise.all(values); // call Promises.all to fullfill all promises
  results.sort((a, b) => Number(a[0]) - Number(b[0]));
  console.log(results);

  const header = [
    // define a header...
    'Núm.',
    'Usuário',
    'Desempenho',
    'Critério de<br>Avaliação',
    'Req.<br>Obrigatórios',
    'Req.<br>Totais',
  ];

  selector.output.lastChild.remove();
  selector.output.appendChild(createCustomElement.table(header, results)); // ...and add a table to the #output
}

function addRepo() {
  // const cohort = selector.cohort.value; // get cohort name from the the #cohort select
  // const project = selector.repos_input.value; // get project name from the #repos_input input
  const cohort = 'sd-014-a';
  const project = 'pixels-art';

  const savedRepos = storage.read('repos');
  if (!savedRepos || !savedRepos.some({ cohort, project })) {
    getRepo(cohort, project);
    storage.write('repos', { cohort, project });
  }
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
    'output'
  );
  // add event listeners
  selector.user_button.addEventListener('click', addUser);
  selector.repos_button.addEventListener('click', addRepo);

  // read from localStorage and restore saved repos
  const savedRepos = storage.read('repos');
  if (savedRepos) {
    savedRepos.forEach((repo) => getRepo(repo.cohort, repo.project));
  }
};

// export objects for testing
export { selector as default };
