import {GitFields} from "./GitReducer";

export enum GIT_ACTION_TYPES {
  UPDATE_PR_DETAILS = 'UPDATE_PR_DETAILS',
}

export interface GitActions {
  type: GIT_ACTION_TYPES;
  payload: GitFields;
}

// update PR details
export const updatePRDetails = (prDetails: GitFields): GitActions => {
  return {
    type: GIT_ACTION_TYPES.UPDATE_PR_DETAILS,
    payload: {
      ...prDetails
    }
  }
}
