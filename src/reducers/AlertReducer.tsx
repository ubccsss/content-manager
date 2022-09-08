import {ALERT_ACTION_TYPES, AlertActions} from "./AlertActions";

export interface AlertData {
  show: boolean;
  url: string;
  urlText: string;
  message: string;
  variant: "primary" | "secondary" | "success" | "info" | "warning" | "danger" | "light" | "dark" | undefined;
}

export const AlertReducer = (state: AlertData, action: AlertActions) => {
  switch (action.type) {
    case ALERT_ACTION_TYPES.UPDATE_ALERT:
      return {
        ...action.payload
      };
    case ALERT_ACTION_TYPES.UPDATE_ALERT_SHOW:
      return {
        ...state,
        show: action.payload.show
      }
    default:
      return state;
  }
}