const assigner = require('assigner');

module.exports = opts => {
  opts = opts || {};

  let state = typeof opts.initial == 'function' ? opts.initial() : {};
  let actions = {};
  let computed = {};
  const ev = [
    () => {
      for (let key in computed) {
        const c = {};
        c[key] = computed[key]();
        state = assigner(state, c);
      }
    }
  ];

  const emit = arg => {
    ev.slice().map(handler => {
      handler(arg);
    });
  };

  return {
    setState: diff => {
      state = assigner(state, diff);
      emit(state);
    },
    action: fn => {
      // prettier-ignore
      actions = assigner(actions, fn(() => new Proxy(state, {
            set: (s, prop, val) => {
              s[prop] = val;
              emit(s);
            }
        }))
      );
    },
    computed: fn => {
      computed = assigner(computed, fn(() => Object.freeze(state)));
      emit(state);
    },
    actions: () => actions,
    state: () => Object.freeze(state),
    onChange: handler => {
      ev.push(handler);
    }
  };
};
