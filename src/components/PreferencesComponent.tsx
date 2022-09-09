import {Sliders2} from 'react-bootstrap-icons'
import {Form, Modal} from "react-bootstrap";
import React, {useState} from "react";
import {useDispatch, useStore} from "../contexts/contexts";
import {updatePrefixDate} from "../reducers/PreferencesActions";
import styles from "./PreferencesComponent.module.css";

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

      <button className={`${styles.gear} float-end pt-lg-2`} onClick={handleShow}>
        <Sliders2 size={24}/>
      </button>
    </>
  )
}
