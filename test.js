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

test('calculates computed state', () => {
  const state1 = nation();

  state1.setState({ foo: 'bar', bar: 'baz' });

  expect(state1.state().foo).toBe('bar');
  expect(state1.state().bar).toBe('baz');
  expect(state1.state()).toEqual({ foo: 'bar', bar: 'baz' });

  state1.computed(state => ({
    fooBar: () => {
      return `${state().foo} - ${state().bar}`;
    }
  }));

  expect(state1.state().foo).toBe('bar');
  expect(state1.state().bar).toBe('baz');
  expect(state1.state().fooBar).toBe('bar - baz');
  expect(state1.state()).toEqual({ foo: 'bar', bar: 'baz', fooBar: 'bar - baz' });

  state1.setState({ foo: 'foo' });

  expect(state1.state().foo).toBe('foo');
  expect(state1.state().bar).toBe('baz');
  expect(state1.state().fooBar).toBe('foo - baz');
  expect(state1.state()).toEqual({ foo: 'foo', bar: 'baz', fooBar: 'foo - baz' });
});

test('state change events', done => {
  const state1 = nation();
  let run = 0;

  state1.emitter.on('state-change', state => {
    run++;

    if (run == 2) done();
  });

  state1.setState({ foo: 'bar', bar: 'baz' });

  expect(state1.state().foo).toBe('bar');
  expect(state1.state().bar).toBe('baz');
  expect(state1.state()).toEqual({ foo: 'bar', bar: 'baz' });

  state1.setState({ bar: 'x' });

  state1.action(state => ({
    setFoo: val => {
      state().foo = val;
    }
  }));

  state1.actions().setFoo('y');

  expect(state1.state().foo).toBe('y');
  expect(state1.state().bar).toBe('x');
  expect(state1.state()).toEqual({ foo: 'y', bar: 'x' });
});
