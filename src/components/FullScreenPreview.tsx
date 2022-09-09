import {ArrowsFullscreen} from 'react-bootstrap-icons'
import {Modal} from "react-bootstrap";
import React, {useState} from "react";
import {OutputPreview} from "./OutputPreview";
import styles from "./FullScreenPreview.module.css";

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

      <button className={`${styles.arrows} float-end pt-lg-2`} onClick={handleShow}>
        <ArrowsFullscreen size={18}/>
      </button>
    </>
  )
}
