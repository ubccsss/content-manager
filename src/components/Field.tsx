import {Form} from "react-bootstrap";
import React from "react";
import {FORM_ACTION_TYPES} from "../reducers/FormActions";
import {FormDataProps} from "../reducers/FormReducer";

interface FieldProps {
  label: string;
  type: "time" | "date" | "text" | "file" | "textarea";
  placeholder?: string;
  actionType: FORM_ACTION_TYPES
  fieldName: keyof FormDataProps;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  multiple?: boolean;
}

export const Field = ({
                        label,
                        type,
                        placeholder = "",
                        actionType,
                        fieldName,
                        onChange,
                        multiple = undefined,
                      }: FieldProps) => {

  if (type === "textarea") {
    return (
      <Form.Group className="mb-3">
        <Form.Label>{label}</Form.Label>
        <Form.Control as="textarea"
                      rows={10}
                      placeholder={placeholder}
                      data-action-type={actionType}
                      data-field-name={fieldName}
                      onChange={onChange}
        />
      </Form.Group>
    );
  }

  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control type={type}
                    multiple={multiple}
                    placeholder={placeholder}
                    data-action-type={actionType}
                    data-field-name={fieldName}
                    onChange={onChange}/>
    </Form.Group>
  );
}
