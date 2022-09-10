import {getCurrentDate} from "./dates";
import {AppStore} from "../contexts/contexts";

// returns a promise that returns a file as a raw binary string when resolved
export const readFile = (file: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (res) => {
      if (res.target) {
        resolve(res.target.result);
      }
    };
    reader.onerror = (err) => reject(err);

    reader.readAsBinaryString(file);
  });
};

// delimits a comma seperated value and returns an array
export const getLink = (file: File) => {
  return URL.createObjectURL(file);
}

// returns file name prefix
export const getFileNamePrefix = (prefixDate: boolean) => {
  return prefixDate ? `/files/${getCurrentDate()}-` : '/files/';
}

// returns the new name of a file
export const getFileName = (name: string, prefixDate: boolean) => {
  return `${getFileNamePrefix(prefixDate)}${name}`;
}

// returns regex for file name prefix
export const getFileNamePrefixRegex = (prefixDate: boolean) => {
  return "\/files\/" + (prefixDate ? getCurrentDate() + "-" : "");
}

// returns formatted file size
export const formatFileSize = (size: number) => {
  const units = ['B', 'KB', 'MB'];
  let unit = size > 1_000 ? size > 1_000_000 ? 2 : 1 : 0;
  return `${Math.round((size / Math.pow(1_000, unit)))} ${units[unit]}`;
}

// returns content for event file
export const getNewEventFileContent = (store: AppStore) => {
  const {body, categories, previewImage, startDate, startTime, endDate, endTime, tags, title, author} = store.form;
  const {prefixDate} = store.preferences;

  return (
    `---
# The title of the event
title: ${title}
# Publishing date when the event appears, not the date of the event.
date: ${getCurrentDate()}
# Tags that apply to the event
tags: [${tags}]
categories: [${categories}]
# Name of the author (you)
author: ${author}
# Images associated to this event. Used for banner.
images:
  - ${previewImage ? getFileName(previewImage[0].name, prefixDate) : ""}
# Start date and time. Used for calendar page.
start_date: ${startDate} ${startTime}
# End date and time (defaults to one hour after start). Used for calendar page.
end_date: ${endDate} ${endTime}
---

${body}
`
  );
}
