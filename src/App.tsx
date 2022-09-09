import React from 'react';
import './App.css';
import {Col, Container, Row} from "react-bootstrap";
import {FormComponent, MarkdownPreview, OutputPreview} from "./components";
import {formInitialState} from './contexts/contexts';
import {RepoIcons} from "./components/RepoIcons";
import {AlertComponent} from "./components/AlertComponent";
import {PreferencesComponent} from "./components/PreferencesComponent";

const App = () => {
  const [isMarkdownPreview, setIsMarkdownPreview] = React.useState(true);

  return (
    <>
      <AlertComponent/>
      <Container fluid>
        <Row xs={1} lg={2} className="row-height">
          <Col className="scrollable pb-4 pt-4">
            <PreferencesComponent/>
            <h1>Create New Event</h1>
            <i className="float-end text-secondary">fields marked with * are required</i>
            <FormComponent
              initialState={formInitialState}
              setIsMarkdownPreview={setIsMarkdownPreview}
            />
          </Col>
          <Col className="scrollable pb-4 pt-lg-4 pt-0">
            <RepoIcons/>
            {isMarkdownPreview ? <MarkdownPreview/> : <OutputPreview/>}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
