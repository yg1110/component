import {observable} from "./Observer";
import {ReduceerType, InitStateType, ActionType} from "../types/Store";

export const createStore = (reducer: ReduceerType) => {
  // 초기 Store생성시 initState를 리턴받고 그값을 observable에 등록한다.
  const initState = observable(reducer());

  // getState가 실제 state를 반환하는 것이 아니라 proxyState 반환하도록 만들어야 한다.
  const proxyState: InitStateType = {};
  Object.keys(initState).forEach(key => {
    Object.defineProperty(proxyState, key, {
      get: () => initState[key], // get만 정의, set은 불가.
    });
  });

  // dispatch로만 state의 값을 변경할 수 있다.
  const dispatch = (action: ActionType): void => {
    const newState: InitStateType = reducer(initState, action);
    for (const [key, value] of Object.entries(newState)) {
      // state의 key가 아닐 경우 변경을 생략한다.
      if (!initState[key]) {
        initState[key] = value;
      }
    }
  };

  const getState: ReduceerType = () => proxyState;

  // subscribe는 observe로 대체한다.
  return {getState, dispatch};
};
