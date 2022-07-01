import { useState, useEffect, useRef } from 'react'
// 让你可以安全地使用 react 的 state，它的值就是你想要的值，
// 而不是陈旧的值。并且也拥有了 callback 的能力。
export function useStateCB(initialState: any): [() => any, (newState: any, callback: any) => any] {
  const [state, setState] = useState<any>(initialState)
  const stateRef = useRef(initialState)
  const callbackRef = useRef<null | ((a: any) => void)>(null)

  useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current(state)
      callbackRef.current = null
    }
  }, [state])

  const newSetState = (newState: any, callback: any) => {
    if (callback) callbackRef.current = callback
    stateRef.current = newState
    setState(newState)
  }

  const getState = () => {
    return stateRef.current
  }

  return [getState, newSetState]
}
// （推荐使用）使用类似于 class 形式的 this.state 和 this.setState 的方式来使用 state。
// 同样可以安全地使用 state，并且拥有 callback 能力
export function useSingleState(initialStateObj: any) {
  const [getState, setState] = useStateCB(initialStateObj);
  const stateObj = useRef({ ...initialStateObj }).current;

  useEffect(() => {
    Object.keys(stateObj).forEach(key => {
      if (key) {
        Object.defineProperty(stateObj, key, {
          get() {
            return getState()[key];
          },
        });
      }
    });
  }, []);

  const newSetState = (partialStates: any, callback: any) => {
    setState({ ...getState(), ...partialStates }, callback);
  }

  return [stateObj, newSetState];
}
//（推荐使用）将所有实例变量声明在一起，并以更接近实例变量的方式使用
export function useSingleInstanceVar(initialValue: any) {
  const instRef = useRef(initialValue);
  const returnVal = useRef({ ...initialValue }).current;

  useEffect(() => {
    Object.keys(returnVal).forEach(key => {
      if (key) {
        Object.defineProperty(returnVal, key, {
          get() {
            return instRef.current[key];
          },
          set(val) {
            instRef.current = { ...instRef.current, [key]: val };
          },
        });
      }
    });
  }, []);

  return returnVal;
}