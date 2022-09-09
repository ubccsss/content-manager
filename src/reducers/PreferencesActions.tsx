import {Preferences} from "./PreferencesReducer";

export enum PREFERENCES_ACTION_TYPES {
  UPDATE_PREFIX_DATE = 'UPDATE_PREFIX_DATE',
}

export interface PreferencesActions {
  type: PREFERENCES_ACTION_TYPES;
  payload: Preferences;
}

// update prefix date
export const updatePrefixDate = (prefixDate: boolean): PreferencesActions => {
  return {
    type: PREFERENCES_ACTION_TYPES.UPDATE_PREFIX_DATE,
    payload: {prefixDate} as Preferences
  }
}
