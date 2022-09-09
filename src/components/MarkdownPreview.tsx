import {getCurrentDate} from "../utils";
import SyntaxHighlighter from 'react-syntax-highlighter';
import {atomOneLight} from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import {useStore} from "../contexts/contexts";

export const MarkdownPreview = () => {
  const store = useStore();
  const {
    body = "",
    categories = "",
    previewImage = "",
    startDate = "",
    startTime = "",
    endDate = "",
    endTime = "",
    tags = "",
    title = "",
    author = ""
  } = store.form;

  const markdown =
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
  - /files/${previewImage ? previewImage[0].name : ""}
# Start date and time. Used for calendar page.
start_date: ${startDate} ${startTime}
# End date and time (defaults to one hour after start). Used for calendar page.
end_date: ${endDate} ${endTime}
---

${body}
`;

  return (
    <>
      <h1>Markdown</h1>
      <SyntaxHighlighter
        style={atomOneLight}
        language={"markdown"}
        wrapLongLines={true}
        customStyle={{overflow: "hidden"}}
      >
        {markdown}
      </SyntaxHighlighter>
    </>
  );
}
