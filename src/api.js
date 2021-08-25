// import { Octokit } from "https://cdn.skypack.dev/@octokit/core";
import { request } from "https://cdn.skypack.dev/@octokit/request";

// errorMsg: output a formatted error message to the screen
const errorMsg = (msg) => alert(`[Error] ${msg}`);

const api = {
  // query(query): queries the API and returns the response as a JSON-formatted object
  query: async (query) => {
    try {
      const response = await request(query, {
        method: 'GET',
        headers: {
          authorization: 'token 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',
        },
        org: 'tryber',
      });
      if (response.data.message === 'Not Found') {
        throw new Error('No result found!');
      }
      return response.data;
    } catch (error) {
      errorMsg(error);
      return null;
    }
  },
};

export { api, errorMsg };