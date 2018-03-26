const mitt = require('mitt');
const assigner = require('assigner');

const emitter = mitt();

module.exports = opts => {
  opts = opts || {};

  let state = typeof opts.initial == 'function' ? opts.initial() : {};
  let actions = {};

  return {
    setState: diff => {
      const newState = assigner(state, diff);

      emitter.emit('state-change', state, newState, diff);

      state = newState;
    },
    action: fn => {
      actions = assigner(actions, fn(() => state));
    },
    actions: () => actions,
    state: () => Object.freeze(state),
    emitter
  };
};
