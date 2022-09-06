import React, {useReducer} from 'react';
import './App.css';
import {Button, ButtonGroup, ButtonToolbar, Col, Container, Dropdown, DropdownButton, Form, Row} from "react-bootstrap";
import {Field, MarkdownPreview, OutputPreview} from "./components";
import {FormDataProps, FormReducer} from "./reducers/FormReducer";
import {FORM_ACTION_TYPES, updateField, updateImage} from "./reducers/FormActions";
import {StateContext} from './contexts';
import {createEvent} from "./utils/github";

const App = () => {
  const initialState: FormDataProps = {
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

  const showOutput = () => {
    setIsMarkdownPreview(false);
  }

  const showMarkdown = () => {
    setIsMarkdownPreview(true);
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const actionType = event.target.getAttribute('data-action-type') as FORM_ACTION_TYPES;
    const fieldName = event.target.getAttribute('data-field-name') as keyof FormDataProps;
    const isImage = fieldName === 'otherImages' || fieldName === 'previewImage';

    if (isImage && event.target.files) {
      // TODO: add check for file types. Only allow images. Throw dismissible alert if not image.
      // https://react-bootstrap.github.io/components/alerts/
      // console.log(actionType, fieldName, files)
      dispatch(updateImage(actionType, fieldName, event.target.files))
    } else {
      dispatch(updateField(actionType, fieldName, event.target.value))
    }
  }

  const handleCreateEvent = async () => {
    await createEvent(state);
  }

  return (
    <StateContext.Provider value={state}>
      <Container fluid>
        <Row xs={1} lg={2}>
          <Col>
            <h1>Create New Event</h1>
            <Form>
              <Field label="Title"
                     type="text"
                     placeholder="title of the event"
                     actionType={FORM_ACTION_TYPES.UPDATE_TITLE}
                     fieldName="title"
                     onChange={onChange}
              />
              <Field label="Tags"
                     type="text"
                     placeholder="comma separated value, eg: event, social"
                     actionType={FORM_ACTION_TYPES.UPDATE_TAGS}
                     fieldName="tags"
                     onChange={onChange}
              />
              <Field label="Categories"
                     type="text"
                     placeholder="comma separated value, eg: event, social"
                     actionType={FORM_ACTION_TYPES.UPDATE_CATEGORIES}
                     fieldName="categories"
                     onChange={onChange}
              />
              <Field label="Author"
                     type="text"
                     placeholder="Name of the author (you)"
                     actionType={FORM_ACTION_TYPES.UPDATE_AUTHOR}
                     fieldName="author"
                     onChange={onChange}
              />
              <Field label="Preview Image (Used for cards)"
                     type="file"
                     actionType={FORM_ACTION_TYPES.UPDATE_PREVIEW_IMAGE}
                     fieldName="previewImage"
                     onChange={onChange}
              />
              <Row>
                <Col>
                  <Field label="Start Date"
                         type="date"
                         actionType={FORM_ACTION_TYPES.UPDATE_START_DATE}
                         fieldName="startDate"
                         onChange={onChange}
                  />
                </Col>
                <Col>
                  <Field label="Start Time"
                         type="time"
                         actionType={FORM_ACTION_TYPES.UPDATE_START_TIME}
                         fieldName="startTime"
                         onChange={onChange}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Field label="End Date"
                         type="date"
                         actionType={FORM_ACTION_TYPES.UPDATE_END_DATE}
                         fieldName="endDate"
                         onChange={onChange}
                  />
                </Col>
                <Col>
                  <Field label="End Time"
                         type="time"
                         actionType={FORM_ACTION_TYPES.UPDATE_END_TIME}
                         fieldName="endTime"
                         onChange={onChange}
                  />
                </Col>
              </Row>
              <Field
                label="Other images (other images that you want to use, you have to select multiple images at together)"
                type="file"
                actionType={FORM_ACTION_TYPES.UPDATE_OTHER_IMAGES}
                fieldName="otherImages"
                onChange={onChange}
                multiple={true}
              />
              <Field label="Body (Use Markdown over HTML as much as possible)"
                     type="textarea"
                     placeholder={"image markdown syntax: ![](/files/image_name.png)"}
                     actionType={FORM_ACTION_TYPES.UPDATE_BODY}
                     fieldName="body"
                     onChange={onChange}
              />
              <ButtonToolbar aria-label="Toolbar with button groups">
                <ButtonGroup className="me-2">
                  <DropdownButton as={ButtonGroup} title="Preview" id="bg-nested-dropdown">
                    <Dropdown.Item onClick={showMarkdown}>Markdown</Dropdown.Item>
                    <Dropdown.Item onClick={showOutput}>Output</Dropdown.Item>
                  </DropdownButton>
                </ButtonGroup>
                <ButtonGroup>
                  <Button variant="primary" onClick={handleCreateEvent}>Create Event</Button>
                </ButtonGroup>
              </ButtonToolbar>
            </Form>
          </Col>
          <Col>
            {isMarkdownPreview ? <MarkdownPreview/> : <OutputPreview/>}
          </Col>
        </Row>
      </Container>
    </StateContext.Provider>
  );
}

export default App;
