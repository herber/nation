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

test('executes actions', done => {
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
    },
    setAsync: async val => {
      const a = () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve(val);
          }, 20);
        });

      state1.setState({
        biz: await a()
      });
    }
  }));

  state1.actions().setFoo('y');
  state1.actions().setBaz('a');
  state1.actions().setAsync('async');

  expect(state1.state().foo).toBe('y');
  expect(state1.state().bar).toBe('x');
  expect(state1.state().baz).toBe('a');
  expect(state1.state()).toEqual({ foo: 'y', bar: 'x', baz: 'a' });

  setTimeout(() => {
    expect(state1.state().biz).toBe('async');
    done();
  }, 21);
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

  state1.onChange(state => {
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

test('nested state', done => {
  const state1 = nation();
  const state2 = nation();
  const state3 = nation();
  const state4 = nation();

  state4.setState({ foo: 'bar' });
  state3.setState({ s: state4 });
  state2.setState({ s: state3 });
  state1.setState({ s: state2 });

  expect(
    state1
      .state()
      .s.state()
      .s.state()
      .s.state().foo
  ).toBe('bar');

  state1.onChange(state => {
    expect(state).toEqual({ foo: 'baz' });
    done();
  });

  state4.setState({ foo: 'baz' });

  expect(
    state1
      .state()
      .s.state()
      .s.state()
      .s.state().foo
  ).toBe('baz');
});
