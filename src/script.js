import api from './api.js';
import createCustomElement from './createCustomElement.js';
import storage from './storage.js';
import data from './data.js';

async function getReposInfo(cohort) {
  cohort = cohort || 'sd-014-a';

  // gets team (cohort) id
  const cohortID = data.teamsID[`students-` + cohort];
  const repos = await api.query(
    `/organizations/55410300/team/${cohortID}/repos`
  );

  // gets project repos
  const projectRepos = repos.reduce((acc, repo) => {
    // checks if repo is a project repo
    if (data.projects.some((project) => repo.name.includes(project)))
      return [
        ...acc,
        repo.pulls_url
          .split('https://api.github.com')[1]
          .split('{/number}')[0]
          .replace('tryber', '{org}'),
      ];
    return acc;
  }, []);

  return projectRepos;
  // returns array of project repos query strings
}

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

// getRepo: reads user input and prints a table with grade information from a repo
async function getRepo(cohort, project) {
  selector.loading.textContent = `loading ${cohort}-project-${project}...`;

  const baseQuery = `/repos/{org}/${cohort}-project-${project}`; // create base query from cohort and project
  const pullRequestsJSON = await api.query(`${baseQuery}/pulls?per_page=100`); // get list of PR's from the GitHub API

  const values = pullRequestsJSON.map(async (element) => {
    // for each PR...
    const { number, user } = element; // get the PR number and user info
    const comments = await api.query(
      `${baseQuery}/issues/${number}/comments?per_page=100`,
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
  results.sort((a, b) => Number(a[0]) - Number(b[0])); // sort the results

  const header = [ // define a header...
    'Núm.',
    'Usuário',
    'Desempenho',
    'Critério de<br>Avaliação',
    'Req.<br>Obrigatórios',
    'Req.<br>Totais',
  ];

  selector.loading.textContent = 'idle.';
  const count = Number(selector.accordionOutput.children.length) + 1;
  selector.accordionOutput.appendChild(createCustomElement.accordionItem(
    count,
    'accordionOutput',
    createCustomElement.span(`${cohort}-project-${project}`, `${cohort}-project-${project}`),
    createCustomElement.table(header, results),
  ));
}

function addRepo() {
  // const cohort = selector.repos_cohort.value; // get cohort name from the the #cohort select
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
    'user_cohort',
    'repos_button',
    'repos_input',
    'repos_cohort',
    'status',
    'loading',
    'accordionOutput',
  );
  // add event listeners
  selector.user_button.addEventListener('click', addUser);
  selector.repos_button.addEventListener('click', addRepo);

  // read from localStorage and restore saved repos
  const savedRepos = storage.read('repos');
  if (savedRepos) {
    savedRepos.forEach((repo) => {
      getRepo(repo.cohort, repo.project);
      console.log(repo);
    });
  }
};

// export objects for testing
export { selector as default };
