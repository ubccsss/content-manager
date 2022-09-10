import {Button, ButtonGroup, Col, Form, Row} from "react-bootstrap";
import React from "react";
import {FormFields} from "../reducers/FormReducer";
import {Formik} from "formik";
import {createEvent} from "../api/github";
import {FIELD_ACTION_MAP, updateField, updateImage} from "../reducers/FormActions";
import * as yup from 'yup';
import {Field, FieldComponent} from "./FieldComponent";
import {useDispatch, useStore} from "../contexts/contexts";
import {formSchema} from "../constants/formSchema";
import {updateAlert} from "../reducers/AlertActions";
import {AlertData} from "../reducers/AlertReducer";

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

interface FormComponentProps {
  initialState: FormFields;
}

export const FormComponent = ({initialState}: FormComponentProps) => {
  const store = useStore();
  const dispatch = useDispatch();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = event.target.name as keyof FormFields;
    const actionType = FIELD_ACTION_MAP[fieldName];
    const isImage = fieldName === 'otherImages' || fieldName === 'previewImage';
    const fileList = event.target.files

    if (isImage && fileList) {
      dispatch(updateImage(actionType, fieldName, fileList));
    } else {
      dispatch(updateField(actionType, fieldName, event.target.value))
    }
  }

  return (
    <Formik
      validationSchema={validationSchema}
      onSubmit={async () => {
        try {
          const {title, html_url} = await createEvent(store);
          dispatch(updateAlert({
            show: true,
            message: `Successfully created event: ${title}`,
            variant: 'success',
            url: html_url,
            urlText: 'Click here to see the PR and deploy preview.'
          }))
        } catch (e : unknown) {
          const message = e instanceof Error ? e.message : String(e)
          dispatch(updateAlert({
            show: true,
            message: `Error creating event: <b><i>${message}</i></b> <br/> Check the console and contact a webmaster.`,
            variant: 'danger',
          } as AlertData))
        }
      }}
      initialValues={initialState}
    >
      {({
          handleSubmit,
          touched,
          errors,
          handleChange,
          setFieldTouched,
          isValid,
          dirty,
          isSubmitting
        }) => (
        <Form onSubmit={handleSubmit}>
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
                              touched={touched[field.name as keyof FormFields]}
                              error={errors[field.name as keyof FormFields]}
                              onChange={(event) => {
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
                    touched={touched[formSchema[key].name as keyof FormFields]}
                    error={errors[formSchema[key].name as keyof FormFields]}
                    onChange={(event) => {
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
            <Button variant="custom" type="submit" disabled={!isValid || !dirty || isSubmitting}>Create Event</Button>
          </ButtonGroup>
        </Form>
      )}
    </Formik>
  );
}
