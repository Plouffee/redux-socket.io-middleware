import { createAction } from 'redux-actions';

export const actions = {
  INCREMENT: createAction('INCREMENT'),
  DECREMENT: createAction('DECREMENT'),
  INCREMENT_DISCONNECT: createAction('INCREMENT_DISCONNECT'),
  INCREMENT_CONNECT: createAction('INCREMENT_CONNECT', (host, port) => {
    return {
      host, port,
    };
  }),
};