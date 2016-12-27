const store = {};

exports.set = (key, value) => {
    store[key] = value;
}

exports.get = (key) => store[key];
