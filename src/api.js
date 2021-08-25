// errorMsg: output a formatted error message to the screen
const errorMsg = (msg) => alert(`[Error] ${msg}`);

const api = {
  // API base URL
  baseURL: '', 

  // queryAPI(query): queries the API and returns the response as a JSON-formatted object
  query: async (query) => {
    if (!query.includes(api.baseURL)) {
      query = api.baseURL.concat(query);
    }
    try {
      const responseRaw = await fetch(query);
      const responseJSON = await responseRaw.json();
      if (responseJSON.message === 'Not Found') {
        throw new Error('No result found!');
      }
      return responseJSON;
    } catch (error) {
      errorMsg(error);
      return null;
    }
  },
};

export { api, errorMsg };