const data = {
  projects: [
    'project-lessons-learned',
    'project-zoo-functions',
    'project-trybewarts',
    'project-todo-list',
    'project-shopping-cart',
    'project-playground-functions',
    'project-pixels-art',
    'project-mistery-letter',
    'project-meme-generator',
    'project-lessons-learned',
    'project-js-unit-tests',
    'project-jest',
    'project-color-guess',
  ],
  teamsID: {
    'students-sd-01': 3419722,
    'students-sd-02': 3514076,
    'students-sd-03': 3638146,
    'students-sd-04': 3697523,
    'students-sd-05': 3791581,
    'students-sd-06': 3936749,
    'students-sd-07': 4163809,
    'students-sd-08': 4163813,
    'students-sd-09': 4301341,
    'students-sd-010-a': 4474466,
    'students-sd-010-b': 4474468,
    'students-sd-011': 4633716,
    'students-sd-012': 4735413,
    'students-sd-013-b': 4815449,
    'students-sd-013-a': 4815462,
    'students-sd-014-b': 4901128,
    'students-sd-014-a': 4901221,
    'students-sd-015-b': 4992000,
    'students-sd-015-a': 4992019,
    'students-sd-016-a': 5048129,
    'students-sd-016-b': 5052657,
  },
};

// to get repos
// https://api.github.com/organizations/55410300/team{/team_id}/repos
// or
// https://api.github.com/teams{/team_id}/repos

export { data as default };