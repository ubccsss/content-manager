import {createContext} from "react";
import {FormDataProps} from "../reducers/FormReducer";

export const StateContext = createContext({} as FormDataProps);
