export default function namedHistory(historyObj, ...args) {
  console.log(args);

  if (typeof historyObj === 'function') {
    return createHistory;
  }

  extendHistory(historyObj);

  return historyObj;

  function createHistory(options = {}) {
    let history = historyObj(options);

    extendHistory(history);

    return history;
  };

  function extendHistory(history) {
    let oldPush = history.push;

    history.push = function() {
      console.log('push called', arguments);
      console.log(history);

      if (arguments.length === 1 && arguments[0][0] && arguments[0][0] !== '/') {
        oldPush.call(history, 'ttt1');
      } else {
        oldPush.apply(history, arguments);
      }
    }
  };
}
