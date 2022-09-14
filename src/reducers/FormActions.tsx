import {FormFields} from "./FormReducer";
import {ComparisonFilesType, getContent} from "../api/github";
import {Buffer} from "buffer";

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
  UPDATE_FORM = 'UPDATE_FORM',
  UPDATE_IS_CHANGED = 'UPDATE_IS_CHANGED',
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
  form: FORM_ACTION_TYPES.UPDATE_FORM,
  isChanged: FORM_ACTION_TYPES.UPDATE_IS_CHANGED
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
export const updateImage = (type: FORM_ACTION_TYPES, fieldName: keyof FormFields, files: File[]): FormActions => {
  return {
    type: type,
    payload: {
      [fieldName]: files
    } as unknown as FormFields
  }
}

// update From using PR data
export const updateForm = async (files: ComparisonFilesType, headRef: string): Promise<FormActions> => {
  // get file names
  const imageFilesNames = files?.filter(file => file.filename.match(/^static\/files\/.*\.(jpg|jpeg|png|gif)$/)).map(file => file.filename);
  const markdownFileName = files?.find(file => file.filename.match(/^content\/events\/.*\.md$/))?.filename;
  if (!markdownFileName || !imageFilesNames || imageFilesNames.length === 0) {
    throw new Error('Could not find md file or image files');
  }

  // get file contents
  const [markdownFile, ...imageFiles] = await getContent([markdownFileName, ...imageFilesNames], headRef);

  // parse markdown file and extract fields
  let eventContent;
  if ("content" in markdownFile.data) {
    eventContent = Buffer.from(markdownFile.data.content, 'base64').toString();
  }
  const title = eventContent?.match(/title: (.*)/)?.[1];
  const tags = eventContent?.match(/tags: \[(.*)\]/)?.[1].split(',').toString();
  const categories = eventContent?.match(/categories: \[(.*)\]/)?.[1].split(',').toString();
  const author = eventContent?.match(/author: (.*)/)?.[1];
  const startDate = eventContent?.match(/start_date: (.*)/)?.[1].split(' ')[0];
  const startTime = eventContent?.match(/start_date: (.*)/)?.[1].split(' ')[1];
  const endDate = eventContent?.match(/end_date: (.*)/)?.[1].split(' ')[0];
  const endTime = eventContent?.match(/end_date: (.*)/)?.[1].split(' ')[1];
  const previewImageName = eventContent?.match(/\/files\/(.*)/)?.[1] || '';
  const otherImages: File[] = [];
  const previewImage: File[] = [];

  // decode image files and store them as File objects
  imageFiles.forEach(image => {
    if ("content" in image.data && "name" in image.data) {
      if (image.data.name === previewImageName) {
        previewImage.push(new File([Buffer.from(image.data.content, 'base64')], image.data.name));
      } else {
        otherImages.push(new File([Buffer.from(image.data.content, 'base64')], image.data.name));
      }
    }
  });

  // extract body from markdown file
  const body = eventContent?.substring(eventContent.indexOf('---', 3) + 3).trim();

  // return action with parsed fields and isChanged set to true
  return {
    type: FORM_ACTION_TYPES.UPDATE_FORM,
    payload: {
      title,
      tags,
      categories,
      author,
      previewImage,
      startDate,
      startTime,
      endDate,
      endTime,
      otherImages,
      body,
      isChanged: true
    } as unknown as FormFields
  }
}

// update isChanged field
export const updateIsChanged = (isChanged: boolean): FormActions => {
  return {
    type: FORM_ACTION_TYPES.UPDATE_IS_CHANGED,
    payload: {
      isChanged: isChanged
    } as unknown as FormFields
  }
}
