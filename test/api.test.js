/**
 * @jest-environment jsdom
 */

 import api from '../src/api';

 // selector
describe('lorem ipsum', () => {
  test('1. lorem', () => {
    expect(true).not.toBeNull();
    expect(true).toEqual(true);
  });
  test('2. ipsum', () => {
    expect(true).not.toBeNull();
    expect(true).toEqual(true);
  });
});
