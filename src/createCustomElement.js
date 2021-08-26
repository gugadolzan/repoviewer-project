import storage from './storage.js';

// createCustomElement: object that creates custom DOM elements
const createCustomElement = {
  // a(href, text): returns a custom <a> element with provided href and text parameters
  a: (href, text) => {
    const anchor = document.createElement('a'); // create a new <a> element
    anchor.setAttribute('href', href); // set the href attribute
    anchor.textContent = text; // set the text content
    return anchor; // return the assembled <a> custom element
  },

  // span(text): returns a custom <span> element with provided id and text parameters
  span: (id, text) => {
    const span = document.createElement('span'); // create a new <span> element
    span.id = id; // set the id name
    span.textContent = text; // set the text content
    return span; // return the assembled <span> custom element
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
    th.addEventListener('click', ({ target }) => { // temporary remove action
      target.parentNode.parentNode.remove();
      storage.clear('repos');
    });
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
    // trh.setAttribute('data-toggle', 'collapse');
    // trh.setAttribute('data-target', '.pr-line');
    ths.forEach((th) => trh.appendChild(createCustomElement.th(th))); // append all headers as custom <th> elements
    return trh; // return the assembled <tr> custom element
  },
};

export { createCustomElement as default };