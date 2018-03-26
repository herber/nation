const nation = require('./');

test('set and get state', () => {
  const state1 = nation();

  state1.setState({ foo: 'bar', bar: 'baz' });

  expect(state1.state().foo).toBe('bar');
  expect(state1.state().bar).toBe('baz');
  expect(state1.state()).toEqual({ foo: 'bar', bar: 'baz' });

  state1.setState({ bar: 'x' });
  expect(state1.state().foo).toBe('bar');
  expect(state1.state().bar).toBe('x');
  expect(state1.state()).toEqual({ foo: 'bar', bar: 'x' });
});

test('executes actions', () => {
  const state1 = nation();

  state1.setState({ foo: 'bar', bar: 'baz' });

  expect(state1.state().foo).toBe('bar');
  expect(state1.state().bar).toBe('baz');
  expect(state1.state().baz).toBe(undefined);
  expect(state1.state()).toEqual({ foo: 'bar', bar: 'baz' });

  state1.setState({ bar: 'x' });

  state1.action(state => ({
    setFoo: val => {
      state().foo = val;
    },
    setBaz: val => {
      state().baz = val;
    }
  }));

  state1.actions().setFoo('y');
  state1.actions().setBaz('a');

  expect(state1.state().foo).toBe('y');
  expect(state1.state().bar).toBe('x');
  expect(state1.state().baz).toBe('a');
  expect(state1.state()).toEqual({ foo: 'y', bar: 'x', baz: 'a' });
});

test('initial state', () => {
  const state1 = nation({
    initial: () => ({
      init: true,
      other: 'initial'
    })
  });

  state1.setState({ foo: 'bar', bar: 'baz' });

  expect(state1.state().foo).toBe('bar');
  expect(state1.state().bar).toBe('baz');
  expect(state1.state().init).toBe(true);
  expect(state1.state().other).toBe('initial');
  expect(state1.state()).toEqual({ foo: 'bar', bar: 'baz', init: true, other: 'initial' });
});
