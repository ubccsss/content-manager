import {Alert, Col, Container, Row} from "react-bootstrap";
import {updateAlertShow} from "../reducers/AlertActions";
import React from "react";
import {useDispatch, useStore} from "../contexts/contexts";

export const AlertComponent = () => {
  const dispatch = useDispatch();
  const {show, url, urlText, variant, message} = useStore().alert;

  return (
    show ? (
      <Container className="position-fixed ps-0 pe-5 pt-5" style={{ zIndex: 1}} fluid>
        <Row className="justify-content-center">
          <Col xs={10} sm={8} md={6} lg={5} xl={4}>
            <Alert variant={variant}
                   onClose={() => dispatch(updateAlertShow(false))}
                   dismissible
                   className="mx-auto"
            >
              <div dangerouslySetInnerHTML={{__html: message}}/>
              {url && urlText && (
                <>
                  <br/>
                  <Alert.Link href={url}>{urlText}</Alert.Link>
                </>
              )}
            </Alert>
          </Col>
        </Row>
      </Container>
    ) : null
  )
}