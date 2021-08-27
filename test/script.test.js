/**
 * @jest-environment jsdom
 */

import selector from '../src/script';

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
