import React from 'react';
import './App.css';
import {Alert, Col, Container, Row} from "react-bootstrap";
import {FormComponent, MarkdownPreview, OutputPreview} from "./components";
import {formInitialState, useDispatch, useStore} from './contexts/contexts';
import {updateAlertShow} from "./reducers/AlertActions";
import {RepoIcons} from "./components/RepoIcons";

const App = () => {
  const [isMarkdownPreview, setIsMarkdownPreview] = React.useState(true);
  const dispatch = useDispatch();
  const store = useStore();
  const alert = store.alert;

  return (
    <>
      {
        alert.show &&
          <div className="w-100 d-flex align-items-center justify-content-center position-fixed">
              <Alert variant={alert.variant} onClose={() => dispatch(updateAlertShow(false))} dismissible style={{maxWidth: "75%"}}>
                <p>
                  {alert.message}
                </p>
                  <Alert.Link href={alert.url}>{alert.urlText}</Alert.Link>
              </Alert>
          </div>
      }
      <Container fluid>
        <Row xs={1} lg={2} className="row-height">
          <Col className="scrollable pb-4 pb-lg-0">
            <h1>Create New Event</h1>
            <i className="float-end text-secondary">fields marked with * are required</i>
            <FormComponent
              initialState={formInitialState}
              setIsMarkdownPreview={setIsMarkdownPreview}
            />
          </Col>
          <Col className="scrollable">
            <RepoIcons/>
            {isMarkdownPreview ? <MarkdownPreview/> : <OutputPreview/>}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
