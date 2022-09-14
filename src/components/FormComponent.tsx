import {Button, ButtonGroup, Col, Form, Row} from "react-bootstrap";
import React from "react";
import {FormFields} from "../reducers/FormReducer";
import {Formik} from "formik";
import {createEvent, updateEvent} from "../api/github";
import {FIELD_ACTION_MAP, updateField, updateImage} from "../reducers/FormActions";
import * as yup from 'yup';
import {Field, FieldComponent} from "./FieldComponent";
import {formInitialState, useDispatch, useStore} from "../contexts/contexts";
import {formSchema} from "../constants/formSchema";
import {updateAlert} from "../reducers/AlertActions";
import {AlertData} from "../reducers/AlertReducer";
import {updatePRDetails} from "../reducers/GitActions";

// validate date and time
export const validateDateTime = (schema: any, type: "date" | "time") => {
  const {startDate, startTime, endDate, endTime} = schema;
  if (startDate && startTime && endDate && endTime) {
    if (startDate === endDate && type === "date") {
      return true;
    }
    return new Date(`${startDate}T${startTime}`) < new Date(`${endDate}T${endTime}`)
  }
  if (startDate && endDate && type === "date") {
    return new Date(startDate) <= new Date(endDate)
  }
  return true;
}

// validationSchema for form validation
const validationSchema = yup.object().shape({
  title: yup.string().required(),
  tags: yup.string().required(),
  categories: yup.string().required(),
  author: yup.string().required(),
  previewImage: yup.string().required(),
  startDate: yup.string().required().test('is-after', 'event must start before it ends', function () {
    return validateDateTime(this.parent, "date");
  }),
  startTime: yup.string().required().test('is-after', 'event must start before it ends', function () {
    return validateDateTime(this.parent, "time");
  }),
  endDate: yup.string().required().test('is-after', 'event must start before it ends', function () {
    return validateDateTime(this.parent, "date");
  }),
  endTime: yup.string().required().test('is-after', 'event must start before it ends', function () {
    return validateDateTime(this.parent, "time");
  }),
  otherImages: yup.string(),
  body: yup.string().required(),
});

export const FormComponent = () => {
  const store = useStore();
  const dispatch = useDispatch();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = event.target.name as keyof FormFields;
    const actionType = FIELD_ACTION_MAP[fieldName];
    const isImage = fieldName === 'otherImages' || fieldName === 'previewImage';
    const fileList = event.target.files;
    const files = fileList ? Array.from(fileList) : undefined;

    if (isImage && files) {
      dispatch(updateImage(actionType, fieldName, files));
    } else {
      dispatch(updateField(actionType, fieldName, event.target.value))
    }
  }

  return (
    <Formik
      validationSchema={validationSchema}
      onSubmit={async () => {
        try {
          if (store.git.prExists) {
            const {data, branchRef, lastCommitSha, lastTreeSha, prNumber} = await updateEvent(store);
            dispatch(updateAlert({
              show: true,
              message: `<p>Successfully <i>updated</i> event: ${store.form.title} by ${store.form.author}</p><p class="m-0"><u>Make sure to review changes and delete unused images and files.</u></p>`,
              variant: 'info',
              url: data.html_url,
              urlText: 'Click here to see the PR and deploy preview.'
            }))
            // update git state with new hashes
            // branchRef and prNumber don't change
            dispatch(updatePRDetails({
              prExists: true,
              branchRef,
              lastCommitSha,
              lastTreeSha,
              prNumber
            }));
          } else {
            const {html_url} = await createEvent(store);
            dispatch(updateAlert({
              show: true,
              message: `Successfully <i>created</i> event:  ${store.form.title} by ${store.form.author}`,
              variant: 'success',
              url: html_url,
              urlText: 'Click here to see the PR and deploy preview.'
            }))
          }
        } catch (e: unknown) {
          console.error(e)
          const message = e instanceof Error ? e.message : String(e)
          dispatch(updateAlert({
            show: true,
            message: `Error creating event: <b><i>${message}</i></b> <br/>`,
            variant: 'danger',
          } as AlertData))
        }
      }}
      initialValues={formInitialState}
      validateOnBlur
    >
      {({
          handleSubmit,
          setFieldTouched,
          isValid,
          dirty,
          isSubmitting,
          handleChange
        }) => {
        return (
          <Form noValidate onSubmit={handleSubmit}>
            {Object.keys(formSchema).map((key, index) => {
              return (
                <React.Fragment key={index}>
                  {Array.isArray(formSchema[key]) ? (
                    <Row xs={1} sm={formSchema[key].length}>
                      {formSchema[key].map((row: any, index: number) => {
                          const field = Object.values(row)[0] as Field;
                          return (
                            <Col key={index}>
                              <FieldComponent
                                field={field}
                                onChange={(event) => {
                                  setFieldTouched(field.name)
                                  onChange(event)
                                  handleChange(event)
                                }}
                                onBlur={() => setFieldTouched(field.name)}
                              />
                            </Col>
                          )
                        }
                      )}
                    </Row>
                  ) : (
                    <FieldComponent
                      field={formSchema[key]}
                      onChange={(event) => {
                        setFieldTouched(formSchema[key].name)
                        onChange(event)
                        handleChange(event)
                      }}
                      onBlur={() => setFieldTouched(formSchema[key].name)}
                    />
                  )}
                </React.Fragment>
              )
            })}
            <ButtonGroup>
              <Button variant="custom" type="submit" disabled={!isValid || !dirty || isSubmitting}>
                {store.git.prExists ? 'Update Event' : 'Create Event'}
              </Button>
            </ButtonGroup>
          </Form>
        )
      }}
    </Formik>
  );
}
