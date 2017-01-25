let undefined;

export default class Reducer {
  actionMap = {}

  defaultState = undefined
  // defaultFn = undefined

  getReducerFn(){
    const reducer = this;

    if (this.defaultFn) {
      return (state = reducer.defaultState, action) => {
        const handlerName = reducer.actionMap[action.type];
        if (handlerName) {
          return reducer[handlerName](state, action);
        }

        return reducer.defaultFn(state, action);
      };
    }

    return (state = reducer.defaultState, action) => {
      const handlerName = reducer.actionMap[action.type];
      if (handlerName) {
        return reducer[handlerName](state, action);
      }

      return state;
    };
  }
}
