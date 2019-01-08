import Maker from '@makerdao/dai';
// import fetchConfig from './fetchConfig';
import { start } from './testchain';

export default class TestChainService extends Maker.PrivateService {
  constructor(name = 'testchain') {
    super(name);
    console.log('TESTCHAIN SERVICE CONSTRUCTOR');
  }

  async initialize() {
    console.log('TESTCHAIN INIT');
  }

  async connect() {
    console.log('TESTCHAIN CONNECT');
  }

  async authenticate() {
    console.log('TESTCHAIN AUTH');
  }

  testServiceMethod(world) {
    return `hello ${world}`;
  }

  async fetchAsyncThing() {
    const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    return await res.json();
  }

  startPhoenix() {
    start();
  }
}
