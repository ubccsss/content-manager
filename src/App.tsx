import React from 'react';
import './App.css';
import {Col, Container, Row} from "react-bootstrap";
import {FormComponent, MarkdownPreview, OutputPreview} from "./components";
import {formInitialState} from './contexts/contexts';
import {AlertComponent} from "./components/AlertComponent";
import {PreferencesComponent} from "./components/PreferencesComponent";
import {FullScreenPreview} from "./components/FullScreenPreview";
import {Box, Github} from "react-bootstrap-icons";
import {Icon} from "./components/Icon";

const App = () => {
  const [isMarkdownPreview, setIsMarkdownPreview] = React.useState(true);

  return (
    <>
      <AlertComponent/>
      <Container fluid>
        <Row xs={1} lg={2} className="row-height">
          <Col className="scrollable pb-4 pt-4">
            <FullScreenPreview/>
            <PreferencesComponent/>
            <h1>Create New Event</h1>
            <i className="float-end text-secondary">fields marked with * are required</i>
            <FormComponent
              initialState={formInitialState}
              setIsMarkdownPreview={setIsMarkdownPreview}
            />
          </Col>
          <Col className="scrollable pb-4 pt-lg-4 pt-0">
            <div className="float-end pt-lg-2">
              <Icon iconName={"Github"} size={32} href="https://github.com/ubccsss/content-manager"/>
              <Icon iconName={"Box"} size={32} href="https://github.com/ubccsss/ubccsss.org"/>
            </div>
            {isMarkdownPreview ? <MarkdownPreview/> : <OutputPreview/>}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
