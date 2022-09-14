import {GIT_ACTION_TYPES, GitActions} from "./GitActions";

export interface GitFields {
  prExists: boolean,
  branchRef: string,
  lastTreeSha: string,
  lastCommitSha: string,
  prNumber: number,
}

export const GitReducer = (state: GitFields, action: GitActions) => {
  switch (action.type) {
    case GIT_ACTION_TYPES.UPDATE_PR_DETAILS:
      return {
        ...action.payload
      }
    default:
      return state;
  }
}
