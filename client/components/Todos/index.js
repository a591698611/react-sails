module.exports = {
  path: 'todos',
  getComponent(nextState, cb) {
    require.ensure([], require => {
      cb(null, require('./Todos.jsx'));
    }, 'todos');
  }
};
