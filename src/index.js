import getIOClient from './middleware/ioclient';
import { initialStateEvents } from './state/defaultEvents';
import { defaultSocketEvents } from './client/defaultEvents';
import { onSocketEvents } from './client/defaultEvents';
import serverEventHandler from './middleware/server';

export const DEFAULT_CONNECT_EVENT = 'CONNECT';

export const DEFAULT_SOCKETIO_OPTIONS = {
  transports: ['websocket'],
};

export const SOCKET_INITIALIZED = {};
export const SOCKETS = {};

export function isInitialized(id) {
  return exports.SOCKET_INITIALIZED[id] || false;
}

export function isConnectAction(action, connectAction, connected) {
  return action.type === connectAction && !connected;
};

export function getSocket(id) {
  return exports.SOCKETS[id] || null;
}

export function generateConnectString(payload) {
  let connStr = `${payload.host}:${payload.port}`;
  if (payload.namespace) {
    connStr += `/${payload.namespace}`;
  }
  return connStr;
}

export function onEventOverride(id) {
  const socket = exports.getSocket(id);
  const onevent = socket.onevent;

  socket.onevent = (packet) => {
    const args = packet.data || [];
    packet.data = ['*'].concat(args);
    onevent.call(socket, packet);
  };
}

export const socketio = (
  initializedSocket = null,
  clientEvents = defaultSocketEvents,
  serverEvents = onSocketEvents,
  stateEvents = initialStateEvents,
  connectAction = DEFAULT_CONNECT_EVENT,
  options = DEFAULT_SOCKETIO_OPTIONS
) => {

  exports.SOCKET_INITIALIZED[connectAction] = false;
  exports.SOCKETS[connectAction] = initializedSocket;

  const IO = getIOClient();
  let socket = null;

  return store => next => action => {

    const IS_CONNECT_ACTION = exports.isConnectAction(action, connectAction, exports.SOCKET_INITIALIZED[connectAction]);

    if (IS_CONNECT_ACTION && exports.getSocket(connectAction) === null) {
      const CONN_STRING = exports.generateConnectString(action.payload);

      exports.SOCKETS[connectAction] = IO.connect(CONN_STRING, options);
      socket = exports.getSocket(connectAction);

      exports.onEventOverride(connectAction);
    }

    return next(action);
  };
};

export default socketio;