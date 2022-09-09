import combineReducers from "react-combine-reducers";
import {AlertData, AlertReducer} from "../reducers/AlertReducer";
import {FormFields, FormReducer} from "../reducers/FormReducer";
import {FormActions} from "../reducers/FormActions";
import {AlertActions} from "../reducers/AlertActions";
import React, {createContext, useContext, useReducer} from "react";
import {Preferences, PreferencesReducer} from "../reducers/PreferencesReducer";
import {PreferencesActions} from "../reducers/PreferencesActions";

export interface AppStore {
  form: FormFields;
  alert: AlertData;
  preferences: Preferences;
}

type Actions = FormActions | AlertActions | PreferencesActions;
type AppReducer = (state: AppStore, action: Actions) => AppStore;

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

const preferencesInitialState: Preferences = {
  prefixDate: true
}

// combined reducers
export const [appReducer, initialState] = combineReducers<AppReducer>({
  form: [FormReducer, formInitialState],
  alert: [AlertReducer, alertInitialState],
  preferences: [PreferencesReducer, preferencesInitialState]
});

export const StateContext = createContext({} as AppStore);
export const DispatchContext = createContext({} as React.Dispatch<Actions>);

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
