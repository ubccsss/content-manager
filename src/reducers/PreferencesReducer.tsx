import {PreferencesActions, PREFERENCES_ACTION_TYPES} from "./PreferencesActions";

export interface Preferences {
  prefixDate: boolean;
}

export const PreferencesReducer = (state: Preferences, action: PreferencesActions) => {
  switch (action.type) {
    case PREFERENCES_ACTION_TYPES.UPDATE_PREFIX_DATE:
      return {
        prefixDate: action.payload.prefixDate
      };
    default:
      return state;
  }
}