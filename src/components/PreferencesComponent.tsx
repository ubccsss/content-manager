import {Form, Modal} from "react-bootstrap";
import React, {useState} from "react";
import {useDispatch, useStore} from "../contexts/contexts";
import {updatePrefixDate} from "../reducers/PreferencesActions";
import {Icon} from "./Icon";

export const PreferencesComponent = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const prefixDate = useStore().preferences.prefixDate;
  const dispatch = useDispatch();

  const handlePrefixDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updatePrefixDate(event.target.checked));
  }

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={true}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Preferences</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Check
            type="checkbox"
            label="Prefix images files with date"
            defaultChecked={prefixDate}
            onChange={handlePrefixDateChange}
          />
        </Modal.Body>
      </Modal>

      <Icon iconName="Sliders2" size={24} onClick={handleShow} buttonClassName="float-end pt-lg-2"/>
    </>
  )
}
