import {FORM_ACTION_TYPES, FormActions} from "./FormActions";

export interface FormFields {
  title: string,
  tags: string,
  categories: string,
  author: string,
  previewImage: FileList | undefined,
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string,
  otherImages: FileList | undefined,
  body: string
}

export const FormReducer = (state: FormFields, action: FormActions) => {
  switch (action.type) {
    case FORM_ACTION_TYPES.UPDATE_TITLE:
      return {
        ...state,
        title: action.payload.title
      };
    case FORM_ACTION_TYPES.UPDATE_START_DATE:
      return {
        ...state,
        startDate: action.payload.startDate
      }
    case FORM_ACTION_TYPES.UPDATE_START_TIME:
      return {
        ...state,
        startTime: action.payload.startTime
      }
    case FORM_ACTION_TYPES.UPDATE_END_DATE:
      return {
        ...state,
        endDate: action.payload.endDate
      };
    case FORM_ACTION_TYPES.UPDATE_END_TIME:
      return {
        ...state,
        endTime: action.payload.endTime
      }
    case FORM_ACTION_TYPES.UPDATE_TAGS:
      return {
        ...state,
        tags: action.payload.tags
      }
    case FORM_ACTION_TYPES.UPDATE_CATEGORIES:
      return {
        ...state,
        categories: action.payload.categories
      }
    case FORM_ACTION_TYPES.UPDATE_AUTHOR:
      return {
        ...state,
        author: action.payload.author
      }
    case FORM_ACTION_TYPES.UPDATE_PREVIEW_IMAGE:
      return {
        ...state,
        previewImage: action.payload.previewImage
      }
    case FORM_ACTION_TYPES.UPDATE_OTHER_IMAGES:
      return {
        ...state,
        otherImages: action.payload.otherImages
      }
    case FORM_ACTION_TYPES.UPDATE_BODY:
      return {
        ...state,
        body: action.payload.body
      }
    default:
      return state;
  }
}
