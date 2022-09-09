import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import ReactDOMServer from 'react-dom/server';
import {delimitCSV, getLink, getPublishDate} from "../utils";
import {useStore} from "../contexts/contexts";
import {getFileNamePrefix, getFileNamePrefixRegex} from "../utils/utils";

export const OutputPreview = () => {
  const store = useStore();
  const {
    body,
    categories,
    otherImages,
    previewImage,
    tags,
    title,
    author
  } = store.form;

  // replace image tags with actual images
  const renderCSVToString = (csv: string) => {
    return ReactDOMServer.renderToString(
      <>
        {
          delimitCSV(csv).map((item: string, index: number) => (
            <>
              <a className="btn btn-primary btn-small badge" href="#" key={index}>{item}</a>
              {' '}
            </>
          ))
        }
      </>
    );
  }

  // returns image tag with the uploaded preview image if it exists
  const renderPreviewImage = () => {
    if (previewImage) {
      return ReactDOMServer.renderToString(
        <img style={{maxWidth: "100%"}} src={getLink(previewImage[0])} alt={previewImage[0].name}/>
      );
    } else {
      return "";
    }
  }

  // process body by replacing Markdown and HTML
  const renderBody = (initial: string) => {
    let value = initial;

    const api = {
      replaceMarkdown: () => {
        value = replaceImages(value, true);
        return api;
      },
      replaceHTML: () => {
        value = replaceImages(value, false);
        return api;
      },
      value: () => {
        return value;
      }
    }
    return api
  }

  // replace images in input with links of the uploaded images
  const replaceImages = (input: string, isMarkdown: boolean) => {
    if (!otherImages && !previewImage) {
      return input;
    }
    const prefix = getFileNamePrefix(store.preferences.prefixDate);
    const prefixRegex = getFileNamePrefixRegex(store.preferences.prefixDate);
    const regex = new RegExp(isMarkdown ? `\!\\[(.*)\\]\\((${prefixRegex}.*\)\\)` : `<img src="(${prefixRegex}.*)" alt="(.*)">`, "g");
    return input.replaceAll(regex, (match, p1, p2) => {
      let alt: string, src: string;
      if (isMarkdown) {
        alt = p1;
        src = p2;
      } else {
        alt = p2;
        src = p1;
      }
      src = src.replaceAll(prefix, "");
      const image = otherImages ? Array.from(otherImages).find((image) => image.name === src) : null;
      if (image) {
        // replace with link to uploaded otherImages
        return ReactDOMServer.renderToString(
          <img style={{maxWidth: "100%"}} src={getLink(image)} alt={alt}/>
        );
      } else {
        if (previewImage && src === previewImage[0].name) {
          // replace with link to uploaded previewImage
          return ReactDOMServer.renderToString(
            <img style={{maxWidth: "100%"}} src={getLink(previewImage[0])} alt={alt}/>
          );
        } else {
          // no match, return original
          return match;
        }
      }
    });
  }

  const markdown = `
  <h1>
    <a class="text-dark text-decoration-none" href="#">${title}</a>
  </h1>
  <div class="text-secondary">
    <time>${getPublishDate()}</time>
    ${author ? `by <span>${author}</span>` : ''}
  </div>
  <div class="text-secondary">
    <strong>tags:</strong>
    ${renderCSVToString(tags)}
  </div>
  <div class="text-secondary">
    <strong>categories:</strong>
    ${renderCSVToString(categories)}
  </div>
  <br/>
  
  ${renderBody(body).replaceMarkdown().replaceHTML().value()}
  
  `;

  return (
    <>
      <h1>Output</h1>
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>
        {markdown}
      </ReactMarkdown>
    </>
  );
}
