import {Alert, Col, Container, Row} from "react-bootstrap";
import {updateAlertShow} from "../reducers/AlertActions";
import React from "react";
import {useDispatch, useStore} from "../contexts/contexts";

export const AlertComponent = () => {
  const dispatch = useDispatch();
  const {show, url, urlText, variant, message} = useStore().alert;

  return (
    show ? (
      <Container className="position-fixed ps-0 pe-5 pt-5 pe-none" style={{ zIndex: 2}} fluid>
        <Row className="justify-content-center">
          <Col xs={10} sm={8} md={6} lg={5} xl={4}>
            <Alert variant={variant}
                   onClose={() => dispatch(updateAlertShow(false))}
                   dismissible
                   className="mx-auto pe-auto"
            >
              <div dangerouslySetInnerHTML={{__html: message}}/>
              {url && urlText && (
                <>
                  <br/>
                  <a href={url} target="_blank" rel="noreferrer" className={`alert-link`}>{urlText}</a>
                </>
              )}
            </Alert>
          </Col>
        </Row>
      </Container>
    ) : null
  )
}