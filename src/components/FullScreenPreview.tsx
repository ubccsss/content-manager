import {Modal} from "react-bootstrap";
import React, {useState} from "react";
import {OutputPreview} from "./OutputPreview";
import styles from "./FullScreenPreview.module.css";
import {Icon} from "./Icon";

export const FullScreenPreview = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={true}
        scrollable={true}
        dialogClassName={styles.dialogWidth}
        size={"xl"}
      >
        <Modal.Header closeButton>
          <Modal.Title>Use <code>Inspect Element</code> to test on different device widths</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OutputPreview showHeader={false}/>
        </Modal.Body>
      </Modal>

      <Icon iconName="ArrowsFullscreen" size={18} onClick={handleShow} buttonClassName="float-end"/>
    </>
  )
}
