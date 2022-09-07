import React, {useReducer} from 'react';
import './App.css';
import {Col, Container, Row} from "react-bootstrap";
import {FormComponent, MarkdownPreview, OutputPreview} from "./components";
import {FormFields, FormReducer} from "./reducers/FormReducer";
import {DispatchContext, StateContext} from './contexts/contexts';

const App = () => {
  const initialState: FormFields = {
    title: "",
    tags: "",
    categories: "",
    author: "",
    previewImage: undefined,
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    otherImages: undefined,
    body: ""
  }

  const [state, dispatch] = useReducer(FormReducer, initialState);
  const [isMarkdownPreview, setIsMarkdownPreview] = React.useState(true);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        <Container fluid>
          <Row xs={1} lg={2}>
            <Col>
              <h1>Create New Event</h1>
              <FormComponent initialState={initialState} setIsMarkdownPreview={setIsMarkdownPreview}/>
            </Col>
            <Col>
              {isMarkdownPreview ? <MarkdownPreview/> : <OutputPreview/>}
            </Col>
          </Row>
        </Container>
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
}

export default App;
