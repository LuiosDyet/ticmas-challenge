const data = {
    Users: require('./users.json'),
    Todos: require('./todos.json'),
};

module.exports = { Users: data.Users, Todos: data.Todos };
