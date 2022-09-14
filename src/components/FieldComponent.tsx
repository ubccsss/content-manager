import {Form} from "react-bootstrap";
import React, {useEffect} from "react";
import {FORM_ACTION_TYPES, updateIsChanged} from "../reducers/FormActions";
import {FormFields} from "../reducers/FormReducer";
import {useDispatch, useStore} from "../contexts/contexts";
import {getFileName} from "../utils";
import {FormikErrors, FormikTouched, FormikValues, useFormikContext} from "formik";

export interface Field {
  label: string;
  type: string;
  placeholder?: string;
  actionType: FORM_ACTION_TYPES;
  name: keyof FormFields;
  multiple?: boolean;
  rows?: number;
}

interface FieldComponentProps {
  field: Field;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onBlur: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const FieldComponent = ({field, onChange, onBlur}: FieldComponentProps) => {
  const store = useStore();
  const dispatch = useDispatch();
  const {label, type, placeholder, name, multiple, rows} = field;
  let conditionalProps: any;
  if (type === 'textarea') {
    conditionalProps = {
      as: 'textarea',
      rows: rows || 10
    }
  } else if (type === 'file') {
    conditionalProps = {
      type: type,
      multiple: multiple
    }
  } else {
    conditionalProps = {
      type: type,
    }
  }

  const {
    touched,
    errors,
    setFieldValue,
    setFieldTouched,
    validateField,
    values,
    initialValues
  }: {
    touched: FormikTouched<FormikValues>,
    errors: FormikErrors<FormikValues>,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void,
    setFieldTouched: (field: string, isTouched?: boolean | undefined, shouldValidate?: boolean | undefined) => void,
    validateField: (field: string) => void,
    values: FormikValues,
    initialValues: FormikValues
  } = useFormikContext<FormFields>();

  const isTouched = touched[name];
  const isError = errors[name];

  // Call setFieldValue and setFieldTouched if state has externally changed
  useEffect(() => {
    if (store.form.isChanged) {
      if (name !== 'previewImage' && name !== 'otherImages') {
        setFieldValue(name, store.form[name] || '');
        setFieldTouched(name, true);
      } else if (name === 'previewImage' && store.form.previewImage) {
        setFieldValue(name, store.form.previewImage[0].name);
        setFieldTouched(name, true);
      } else if (name === 'otherImages' && store.form.otherImages) {
        setFieldValue(name, `${store.form.previewImage?.length} files`);
        setFieldTouched(name, true);
      }
    }
  }, [store.form[name]])

  // the useEffect above will trigger this one since values will change
  // we will now validate the new value in the field and set store.form.isChanged to false
  useEffect(() => {
    if (store.form.isChanged) {
      if (values[name] !== initialValues[name]) {
        validateField(name);
      }
      dispatch(updateIsChanged(false));
    }
  }, [values, initialValues])

  // display file names if files are selected
  const renderFileNames = (fieldName: string) => {
    const files: File[] | undefined = store.form[name] as File[];
    if (files && (fieldName === 'otherImages' || fieldName === 'previewImage')) {
      return (
        <Form.Control.Feedback type="valid">
          <ul className="dashed">
            {Array.from(files).map((file, index) => (
              <li key={index}>{getFileName(file.name, store.preferences.prefixDate)}</li>
            ))}
          </ul>
        </Form.Control.Feedback>
      )
    }
  }

  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        {...conditionalProps}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        isValid={isTouched && !isError}
        isInvalid={isTouched && isError}
        accept={type === 'file' ? 'image/*' : undefined}
        step={type === 'time' ? 1 : undefined}
        value={type !== 'file' ? store.form[name] : undefined}
      />
      {renderFileNames(name)}
      <Form.Control.Feedback type="invalid">
        <>{isError}</>
      </Form.Control.Feedback>
    </Form.Group>
  )
}
