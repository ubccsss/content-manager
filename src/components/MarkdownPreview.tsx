import SyntaxHighlighter from 'react-syntax-highlighter';
import {atomOneLight} from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import {useStore} from "../contexts/contexts";
import {getNewEventFileContent} from "../utils/utils";

export const MarkdownPreview = () => {
  const store = useStore();

  return (
    <>
      <h1>Markdown</h1>
      <SyntaxHighlighter
        style={atomOneLight}
        language={"markdown"}
        wrapLongLines={true}
        customStyle={{overflow: "hidden", width: "100%"}}
      >
        {getNewEventFileContent(store)}
      </SyntaxHighlighter>
    </>
  );
}
