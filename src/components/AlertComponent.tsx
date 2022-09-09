import {Alert} from "react-bootstrap";
import {updateAlertShow} from "../reducers/AlertActions";
import React from "react";
import {useDispatch, useStore} from "../contexts/contexts";

export const AlertComponent = () => {
  const dispatch = useDispatch();
  const {show, url, urlText, variant, message} = useStore().alert;

  return (
    show ? (
      <div className="w-100 d-flex align-items-center justify-content-center position-fixed">
          <Alert variant={variant}
            onClose={() => dispatch(updateAlertShow(false))}
            dismissible style={{maxWidth: "75%"}}
          >
            <div dangerouslySetInnerHTML={{__html: message}}/>
            {url && urlText && (
              <>
                <br/>
                <Alert.Link href={url}>{urlText}</Alert.Link>
              </>
            )}
          </Alert>
      </div>
    ) : null
  )
}