import api from './api.js';
import createCustomElement from './createCustomElement.js';
import storage from './storage.js';
import data from './data.js';

async function getReposInfo(cohort = 'sd-014-a') {
  // gets team (cohort) id
  const cohortID = data.teamsID[cohort];
  const repos = await api.query(
    `/organizations/55410300/team/${cohortID}/repos`
  );

  // gets project repos
  const projectRepos = repos.reduce((acc, repo) => {
    // checks if repo is a project repo
    if (repo.name.includes('project')) {
      return [...acc, repo.pulls_url.split('tryber/')[1].split('/pulls')[0]];
    }
    return acc;
  }, []);

  console.log(projectRepos);
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
async function getRepo(projectName) {
  selector.loading.textContent = `loading ${projectName}...`;

  const baseQuery = `/repos/{org}/${projectName}`; // create base query from cohort and project
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
  results.sort((a, b) => Number(a[0]) - Number(b[0])); // sort the results

  const header = [
    // define a header...
    'Núm.',
    'Usuário',
    'Desempenho',
    'Critério de<br>Avaliação',
    'Req.<br>Obrigatórios',
    'Req.<br>Totais',
  ];

  selector.loading.textContent = 'idle.'; // set the idle message in the status line

  /* const div = createCustomElement.div('titulo', '');
  const button = createCustomElement.button('', 'btn btn-default');
  button.appendChild(createCustomElement.span(null, 'glyphicon glyphicon-remove', null));
  div.appendChild(button);
  div.appendChild();
  */

  selector.accordionOutput.appendChild(
    createCustomElement.accordionItem(
      Number(selector.accordionOutput.children.length) + 1,
      'accordionOutput',
      createCustomElement.span(projectName, '', projectName),
      createCustomElement.table(header, results)
    )
  );
}

function addRepo() {
  const projectName = `${selector.repos_cohort.value}-project-${selector.repos_input.value}`; // get project name from the #repos_input input and #repos_cohort select
  if (!projectName) {
    return;
  }
  const savedRepos = storage.read('repos');
  console.log(savedRepos);
  // if (!savedRepos || !savedRepos.some({ cohort, project })) {
  getRepo(projectName);
  storage.write('repos', projectName);
  // }
}

async function getProjecReposFromCohort() {
  // clear selector.projects_cohort options
  selector.projects_cohort.innerHTML =
    '<option disabled selected>ESCOLHA O PROJETO</option>';

  const cohort = selector.repos_cohort.value;
  // get the list of projects from the cohort
  const projectRepos = await getReposInfo(cohort);

  projectRepos.forEach((project) => {
    const text = project.split('project-')[1].replace(/-/g, ' ').toUpperCase();
    selector.projects_cohort.appendChild(
      createCustomElement.option(project, text)
    );
  });
}

// element initialization on page load
window.onload = () => {
  // load DOM selectors
  selector.add(
    'user_button',
    'user_input',
    'user_cohort',
    'projects_cohort',
    'repos_button',
    'repos_input',
    'repos_cohort',
    'status',
    'loading',
    'accordionOutput'
  );
  // add event listeners
  // selector.user_button.addEventListener('click', addUser);
  // selector.repos_button.addEventListener('click', addRepo);

  // read from localStorage and restore saved repos
  const savedRepos = storage.read('repos');
  if (savedRepos) {
    savedRepos.forEach((repo) => getRepo(repo));
  }

  // dynamically build the cohort list
  Object.keys(data.teamsID).forEach((key) => {
    const text = `TURMA ${key.split('sd-0')[1].toUpperCase()}`;
    // selector.user_cohort.appendChild(createCustomElement.option(key, text, (key === 'sd-014-a')));
    selector.repos_cohort.appendChild(
      // createCustomElement.option(key, text, key === 'sd-014-a')
      createCustomElement.option(key, text)
    );
  });

  // add project list to the cohort select
  selector.repos_cohort.addEventListener('change', () =>
    getProjecReposFromCohort()
  );

  // selector.projects_cohort.addEventListener('change', );
};

// export objects for testing
export { selector as default };
