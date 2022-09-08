import {AlertData} from "./AlertReducer";

export enum ALERT_ACTION_TYPES{
  UPDATE_ALERT = 'UPDATE_ALERT',
  UPDATE_ALERT_SHOW = 'UPDATE_ALERT_SHOW',
}

export interface AlertActions {
  type: ALERT_ACTION_TYPES;
  payload: AlertData;
}

// update alert
export const updateAlert = (alert: AlertData): AlertActions => {
  return {
    type: ALERT_ACTION_TYPES.UPDATE_ALERT,
    payload: alert
  }
}

// update whether to show the alert
export const updateAlertShow = (show: boolean): AlertActions => {
  return {
    type: ALERT_ACTION_TYPES.UPDATE_ALERT_SHOW,
    payload: {show: show} as AlertData
  }
}