import {FormFields} from "./FormReducer";

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

export const FIELD_ACTION_MAP = {
  title: FORM_ACTION_TYPES.UPDATE_TITLE,
  tags: FORM_ACTION_TYPES.UPDATE_TAGS,
  categories: FORM_ACTION_TYPES.UPDATE_CATEGORIES,
  author: FORM_ACTION_TYPES.UPDATE_AUTHOR,
  previewImage: FORM_ACTION_TYPES.UPDATE_PREVIEW_IMAGE,
  startDate: FORM_ACTION_TYPES.UPDATE_START_DATE,
  startTime: FORM_ACTION_TYPES.UPDATE_START_TIME,
  endDate: FORM_ACTION_TYPES.UPDATE_END_DATE,
  endTime: FORM_ACTION_TYPES.UPDATE_END_TIME,
  otherImages: FORM_ACTION_TYPES.UPDATE_OTHER_IMAGES,
  body: FORM_ACTION_TYPES.UPDATE_BODY,
}

export interface FormActions {
  type: FORM_ACTION_TYPES;
  payload: FormFields;
}

// update fields that are strings
export const updateField = (type: FORM_ACTION_TYPES, fieldName: keyof FormFields, value: string): FormActions => {
  return {
    type: type,
    payload: {
      [fieldName]: value
    } as unknown as FormFields
  }
}

// update image fields
export const updateImage = (type: FORM_ACTION_TYPES, fieldName: keyof FormFields, files: FileList): FormActions => {
  return {
    type: type,
    payload: {
      [fieldName]: files
    } as unknown as FormFields
  }
}
