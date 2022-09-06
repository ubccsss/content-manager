import {FormDataProps} from "./FormReducer";

export enum FORM_ACTION_TYPES {
  UPDATE_TITLE = 'UPDATE_TITLE',
  UPDATE_TAGS = 'UPDATE_TAGS',
  UPDATE_CATEGORIES = 'UPDATE_CATEGORIES',
  UPDATE_AUTHOR = 'UPDATE_AUTHOR',
  UPDATE_PREVIEW_IMAGE = 'UPDATE_PREVIEW_IMAGE',
  UPDATE_START_DATE = 'UPDATE_START_DATE',
  UPDATE_START_TIME = 'UPDATE_START_TIME',
  UPDATE_END_DATE = 'UPDATE_END_DATE',
  UPDATE_END_TIME = 'UPDATE_END_TIME',
  UPDATE_OTHER_IMAGES = 'UPDATE_OTHER_IMAGES',
  UPDATE_BODY = 'UPDATE_BODY',
}

export const ACTION_FIELD_MAP = {
  [FORM_ACTION_TYPES.UPDATE_TITLE]: "title",
  [FORM_ACTION_TYPES.UPDATE_TAGS]: "tags",
  [FORM_ACTION_TYPES.UPDATE_CATEGORIES]: "categories",
  [FORM_ACTION_TYPES.UPDATE_AUTHOR]: "author",
  [FORM_ACTION_TYPES.UPDATE_PREVIEW_IMAGE]: "previewImage",
  [FORM_ACTION_TYPES.UPDATE_START_DATE]: "startDate",
  [FORM_ACTION_TYPES.UPDATE_START_TIME]: "startTime",
  [FORM_ACTION_TYPES.UPDATE_END_DATE]: "endDate",
  [FORM_ACTION_TYPES.UPDATE_END_TIME]: "endTime",
  [FORM_ACTION_TYPES.UPDATE_OTHER_IMAGES]: "otherImages",
  [FORM_ACTION_TYPES.UPDATE_BODY]: "body",
}

export interface FormActions {
  type: FORM_ACTION_TYPES;
  payload: FormDataProps;
}

// update fields that are strings
export const updateField = (type: FORM_ACTION_TYPES, fieldName: keyof FormDataProps, value: string): FormActions => {
  return {
    type: type,
    payload: {
      [fieldName]: value
    } as unknown as FormDataProps
  }
}

// update fields that are FileLists
export const updateImage = (type: FORM_ACTION_TYPES, fieldName: keyof FormDataProps, files: FileList): FormActions => {
  return {
    type: type,
    payload: {
      [fieldName]: files
    } as unknown as FormDataProps
  }
}
