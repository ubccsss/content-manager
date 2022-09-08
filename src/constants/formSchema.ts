import {FORM_ACTION_TYPES} from "../reducers/FormActions";

// Schema for the form
export const formSchema: any = {
  title: {
    label: "Title*",
    type: "text",
    placeholder: "Enter title",
    actionType: FORM_ACTION_TYPES.UPDATE_TITLE,
    name: "title"
  },
  tags: {
    label: "Tags*",
    type: "text",
    placeholder: "comma separated value, eg: event, social",
    actionType: FORM_ACTION_TYPES.UPDATE_TAGS,
    name: "tags"
  },
  categories: {
    label: "Categories*",
    type: "text",
    placeholder: "comma separated value, eg: event, social",
    actionType: FORM_ACTION_TYPES.UPDATE_CATEGORIES,
    name: "categories"
  },
  author: {
    label: "Author*",
    type: "text",
    placeholder: "Name of the author (you)",
    actionType: FORM_ACTION_TYPES.UPDATE_AUTHOR,
    name: "author"
  },
  previewImage: {
    label: "Preview Image* (Used for cards)",
    type: "file",
    placeholder: "Select preview image",
    actionType: FORM_ACTION_TYPES.UPDATE_PREVIEW_IMAGE,
    name: "previewImage"
  },
  row0: [{
    startDate: {
      label: "Start Date*",
      type: "date",
      placeholder: "Select start date",
      actionType: FORM_ACTION_TYPES.UPDATE_START_DATE,
      name: "startDate"
    }
  }, {
    startTime: {
      label: "Start Time*",
      type: "time",
      placeholder: "Select start time",
      actionType: FORM_ACTION_TYPES.UPDATE_START_TIME,
      name: "startTime"
    }
  }],
  row1: [{
    startDate: {
      label: "End Date*",
      type: "date",
      placeholder: "Select end date",
      actionType: FORM_ACTION_TYPES.UPDATE_END_DATE,
      name: "endDate"
    }
  }, {
    startTime: {
      label: "End Time*",
      type: "time",
      placeholder: "Select end time",
      actionType: FORM_ACTION_TYPES.UPDATE_END_TIME,
      name: "endTime"
    }
  }],
  otherImages: {
    label: "Other images (other images that you want to use, you have to select multiple images at together)",
    type: "file",
    placeholder: "Select other images",
    actionType: FORM_ACTION_TYPES.UPDATE_OTHER_IMAGES,
    name: "otherImages",
    multiple: true
  },
  body: {
    label: "Body* (Use Markdown over HTML as much as possible)",
    type: "textarea",
    placeholder: "image markdown syntax: ![](/files/image_name.png)",
    actionType: FORM_ACTION_TYPES.UPDATE_BODY,
    name: "body",
    rows: 10
  }
}
