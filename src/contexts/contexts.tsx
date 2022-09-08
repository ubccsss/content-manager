import combineReducers from "react-combine-reducers";
import {AlertData, AlertReducer} from "../reducers/AlertReducer";
import {FormFields, FormReducer} from "../reducers/FormReducer";
import {FormActions} from "../reducers/FormActions";
import {AlertActions} from "../reducers/AlertActions";
import React, {createContext, useContext, useReducer} from "react";

interface AppState {
  form: FormFields;
  alert: AlertData;
}

type Actions = FormActions | AlertActions;
type AppReducer = (state: AppState, action: Actions) => AppState;

export const formInitialState: FormFields = {
  title: "",
  tags: "",
  categories: "",
  author: "",
  previewImage: undefined,
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  otherImages: undefined,
  body: ""
}

const alertInitialState: AlertData = {
  show: false,
  message: "",
  url: "",
  urlText: "",
  variant: undefined
}

// combined reducers
export const [appReducer, initialState] = combineReducers<AppReducer>({
  form: [FormReducer, formInitialState],
  alert: [AlertReducer, alertInitialState]
});

export const StateContext = createContext({} as AppState);
export const DispatchContext = createContext({} as React.Dispatch<FormActions | AlertActions>);

// provider gives access to store and dispatch
export const AppProvider = ({children}: any) => {
  const [store, dispatch] = useReducer<AppReducer>(
    appReducer,
    initialState
  );

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={store}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  )
}

// hook for accessing dispatch
export const useDispatch = () => {
  const dispatch = useContext(DispatchContext);
  if (dispatch === undefined) {
    throw new Error('useDispatch must be used within a Provider');
  }
  return dispatch;
}

// hook for accessing state
export const useStore = () => {
  const state = useContext(StateContext);
  if (state === undefined) {
    throw new Error('useState must be used within a Provider');
  }
  return state;
}
