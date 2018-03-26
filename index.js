const emitter = require('mitt')();
const assigner = require('assigner');

module.exports = opts => {
  opts = opts || {};

  let state = typeof opts.initial == 'function' ? opts.initial() : {};
  let actions = {};
  let computed = {};

  emitter.on('state-change', () => {
    for (let key in computed) {
      const c = {};
      c[key] = computed[key]();
      state = assigner(state, c);
    }
  });

  return {
    setState: diff => {
      state = assigner(state, diff);
      emitter.emit('state-change', state);
    },
    action: fn => {
      // prettier-ignore
      actions = assigner(actions, fn(() => new Proxy(state, {
            set: (s, prop, val) => {
              s[prop] = val;
              emitter.emit('state-change', s);
            }
        }))
      );
    },
    computed: fn => {
      computed = assigner(computed, fn(() => Object.freeze(state)));
      emitter.emit('state-change', state);
    },
    actions: () => actions,
    state: () => Object.freeze(state),
    emitter
  };
};
