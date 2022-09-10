import React from 'react';
import './App.css';
import {Container, Row} from "react-bootstrap";
import {
  AlertComponent,
  FormComponent,
  FullScreenPreviewModal,
  Icon,
  MarkdownPreview,
  OutputPreview,
  PreferencesModal,
  ScrollableCol,
  ImagesModal
} from "./components";
import {formInitialState} from './contexts/contexts';

const App = () => {
  const [isMarkdownPreview, setIsMarkdownPreview] = React.useState(true);

  return (
    <>
      <AlertComponent/>
      <Container fluid>
        <Row xs={1} lg={2} className="row-height">
          <ScrollableCol>
            <ScrollableCol.Header title="Create New Event">
              <Icon iconName="MarkdownFill" size={24} onClick={() => {
                setIsMarkdownPreview(true)
              }}/>
              <Icon iconName="FiletypeHtml" size={24} onClick={() => {
                setIsMarkdownPreview(false)
              }}/>
              <ImagesModal/>
              <PreferencesModal/>
              <FullScreenPreviewModal/>
            </ScrollableCol.Header>
            <ScrollableCol.Body>
              <i className="float-end text-secondary">fields marked with * are required</i>
              <FormComponent initialState={formInitialState}/>
            </ScrollableCol.Body>
          </ScrollableCol>
          <ScrollableCol>
            <ScrollableCol.Header title={isMarkdownPreview ? "Markdown" : "Output"}>
              <Icon iconName="Box" size={28} href="https://github.com/ubccsss/ubccsss.org"/>
              <Icon iconName="Github" size={28} href="https://github.com/ubccsss/content-manager"/>
            </ScrollableCol.Header>
            <ScrollableCol.Body>
              {!isMarkdownPreview && <hr className="dashed"/>}
              {isMarkdownPreview ? <MarkdownPreview/> : <OutputPreview/>}
            </ScrollableCol.Body>
          </ScrollableCol>
        </Row>
      </Container>
    </>
  );
}

export default App;
