import {Form} from "react-bootstrap";
import React from "react";
import {FORM_ACTION_TYPES} from "../reducers/FormActions";
import {FormFields} from "../reducers/FormReducer";
import {useState} from "../contexts/contexts";
import styles from "./FieldComponent.module.css";

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
  touched: boolean | undefined,
  error: string | undefined,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onBlur: () => void
}

export const FieldComponent = ({
                                 field,
                                 touched,
                                 error,
                                 onChange,
                                 onBlur
                               }: FieldComponentProps) => {
  const state = useState();
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

  const renderFileNames = (fieldName: string) => {
    const files: FileList | undefined = state[name] as FileList;
    if (files && (fieldName === 'otherImages' || fieldName === 'previewImage')) {
      return (
        <Form.Control.Feedback type="valid">
          <ul className={styles.dashed}>
            {Array.from(files).map((file, index) => (
              <li key={index}>{`/files/${file.name}`}</li>
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
        className={touched && !error ? "is-valid" : touched && error ? "is-invalid" : ""}
        accept={type === 'file' ? 'image/*' : undefined}
      />
      {renderFileNames(name)}
      <Form.Control.Feedback type="invalid">
        {error}
      </Form.Control.Feedback>
    </Form.Group>
  )
}
