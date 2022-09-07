import React, {createContext} from "react";
import {FormFields} from "../reducers/FormReducer";
import {FormActions} from "../reducers/FormActions";

export const StateContext = createContext({} as FormFields);
export const DispatchContext = createContext({} as React.Dispatch<FormActions>);

// hook for accessing dispatch
export const useDispatch = () => {
  const dispatch = React.useContext(DispatchContext);
  if (dispatch === undefined) {
    throw new Error('useDispatch must be used within a Provider');
  }
  return dispatch;
}

// hook for accessing state
export const useState = () => {
  const state = React.useContext(StateContext);
  if (state === undefined) {
    throw new Error('useState must be used within a Provider');
  }
  return state;
}