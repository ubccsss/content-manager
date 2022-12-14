import SyntaxHighlighter from 'react-syntax-highlighter';
import {atomOneLight} from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import {useStore} from "../contexts/contexts";
import {getNewEventFileContent} from "../utils";

export const MarkdownPreview = () => {
  const store = useStore();

  return (
    <SyntaxHighlighter
      style={atomOneLight}
      language={"markdown"}
      wrapLongLines={true}
      customStyle={{overflow: "hidden", width: "100%"}}
    >
      {getNewEventFileContent(store)}
    </SyntaxHighlighter>
  );
}
