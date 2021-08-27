/**
 * @jest-environment jsdom
 */

 import createCustomElement from '../src/createCustomElement';

// createCustomElement 
describe('Verificar o retorno da função CreateCustomElement no HTML', () => {
  test('1. Verifica se o atributo "a" retorna o HTML', () => {
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
  test('3. Verifica se o atributo "trd" (javascript) retorna o HTML', () => {
    const params = ['pr', 'username', 'desempenho', 'criterio', 'reqob', 'reqtot'];
    const trResult = createCustomElement.trd(...params);
    expect(trResult).not.toBeNull();
    expect(trResult.className).toBe('pr-line');
    expect(trResult.childNodes.length).toBe(params.length);
    for (let index = 0; index < params.length; index += 1) {
      expect(trResult.childNodes[index].textContent).toEqual(params[index]);
    }
  });
  test('4. Verifica se o atributo "th" retorna o HTML: contents', () => {
    const th = createCustomElement.th('pally');
    expect(th).not.toBeNull();
    expect(th.className).toBe('pr-header');
    expect(th.textContent).toEqual('pally');
  });
  test('5. Verifica se o atributo "trh" (javascript) retorna o HTML', () => {
    const params = ['pr', 'username', 'desempenho', 'criterio', 'reqob', 'reqtot'];
    const trh = createCustomElement.trh(...params);
    expect(trh).not.toBeNull();
    expect(trh.className).toBe('pr-header');
    expect(trh.childNodes.length).toBe(params.length);
    for (let index = 0; index < params.length; index += 1) {
      expect(trh.childNodes[index].textContent).toEqual(params[index]);
    }
  });
  test('6. Verifica se o elemento table (javascript) retorna o HTML', () => {
    const header = ['pr', 'username', 'desempenho', 'criterio', 'reqob', 'reqtot'];
    const results = [
      ['45', 'marialves', 'Suficiente', 'Padrão', '100,00%', '100,00%'],
      ['100', 'pedro-barboza', 'Suficiente','Recuperação', '100,00%', '91,67%'],
      ['5', 'carlosouZ', 'Suficiente', 'Padrão', '88.89%', '66,67%'],
    ];
    const table = createCustomElement.table(header, results);
    expect(table).not.toBeNull();
    expect(table.className).toBe('pr-table');
    expect(table.childNodes.length).toBe(results.length + 1);
  });
});
