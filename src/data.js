const data = {
  teamsID: {
    'sd-01': 3419722,
    'sd-02': 3514076,
    'sd-03': 3638146,
    'sd-04': 3697523,
    'sd-05': 3791581,
    'sd-06': 3936749,
    'sd-07': 4163809,
    'sd-08': 4163813,
    'sd-09': 4301341,
    'sd-010-a': 4474466,
    'sd-010-b': 4474468,
    'sd-011': 4633716,
    'sd-012': 4735413,
    'sd-013-a': 4815462,
    'sd-013-b': 4815449,
    'sd-014-a': 4901221,
    'sd-014-b': 4901128,
    'sd-015-a': 4992019,
    'sd-015-b': 4992000,
    'sd-016-a': 5048129,
    'sd-016-b': 5052657,
  },
};

// to get repos
// https://api.github.com/organizations/55410300/team{/team_id}/repos
// or
// https://api.github.com/teams{/team_id}/repos

export { data as default };
