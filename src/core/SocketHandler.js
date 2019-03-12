import { Socket } from 'phoenix';
import Observable from 'zen-observable';
import ChannelHandler from './ChannelHandler';
import debug from 'debug';

export default class SocketHandler {
  constructor(url = 'ws://127.1:4000/socket') {
    this._socket = new Socket(url, {
      transport: WebSocket
    });

    this._stream = new Observable(subscriber => {
      this._socket.onOpen(() => {
        subscriber.next({ eventName: 'socket_open' });
      });

      this._socket.onMessage(msg => {
        subscriber.next(msg);
      });
    });

    this._globalLogger = debug('log');
    this._socketLog = this._globalLogger.extend('socket');

    this._logger = this._stream.subscribe(value =>
      this._socketLog(JSON.stringify(value, null, 4))
    );

    this._channels = {};
  }

  get channels() {
    return Object.keys(this._channels);
  }

  get connected() {
    return this._socket.isConnected();
  }

  _once(_eventName) {
    return new Promise(resolve => {
      const observer = this._stream.subscribe(({ eventName }) => {
        if (_eventName === eventName) {
          observer.unsubscribe();
          resolve();
        }
      });
    });
  }

  async init() {
    this._socket.connect();
    await this._once('socket_open');
  }

  channel(name) {
    name = name === 'api' ? 'api' : `chain:${name}`;
    if (!this._channels[name]) {
      this._channels[name] = new ChannelHandler(
        name,
        this._socket,
        this._globalLogger
      );
    }
    return this._channels[name];
  }

  removeChannel(id) {
    delete this._channels[id];
  }

  sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
}
