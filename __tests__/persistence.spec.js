/// <reference types="jest" />
import * as helpers from '../src/core/persistence';

describe('persistence.saveState', () => {
  it('should save the state to local storage', async () => {
    let saveStateKey = 'save-this-123';
    let data = { test: 'data' };
    await helpers.saveState(saveStateKey, data);
    const res = await helpers.loadState(saveStateKey);
    expect(res).toStrictEqual(data);
  });
});

describe('persistence.loadState', () => {
  let saveStateKey, data;

  beforeAll(() => {
    saveStateKey = 'save-this';
    data = { hello: 'world' };
    return helpers.saveState(saveStateKey, data);
  });

  it('should load the state from local storage', async () => {
    const res = await helpers.loadState(saveStateKey);
    expect(res).toStrictEqual(data);
  });
});