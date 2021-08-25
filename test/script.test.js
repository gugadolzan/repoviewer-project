/**
 * @jest-environment jsdom
 */

 import { createCustomElement } from '../src/script';

// createCustomElement 
describe('Verificar o retorno da função CreateCustomElement no HTML', () => {
  test('1. Verifica se o atributo "href" retorna o HTML', () => {
    const result = createCustomElement.a('http://github.com/lysprestes', 'lysprestes');
    expect(result).not.toBeNull();
    expect(result.href).toEqual('http://github.com/lysprestes');
    expect(result.text).toEqual('lysprestes');
  });
  test('2. Verifica se o atributo "td" retorna o HTML: className e textContent', () => {
    const tdResult = createCustomElement.td('pally');
    expect(tdResult).not.toBeNull();
    expect(tdResult.className).toBe('pr-cell');
    expect(tdResult.textContent).toEqual('pally');
  });
  test('3. Verifica se o atributo "tr" (javascript) retorna o HTML', () => {
    const params = ['pr', 'username', 'desempenho', 'criterio', 'reqob', 'reqtot'];
    const trResult = createCustomElement.tr(...params);
    expect(trResult).not.toBeNull();
    expect(trResult.className).toBe('pr-line');
    expect(trResult.childNodes.length).toBe(params.length);
    for (let index = 0; index < params.length; index += 1) {
      expect(trResult.childNodes[index].textContent).toEqual(params[index]);
    }
  });
});
