import {Col} from "react-bootstrap";
import React from "react";

export const ScrollableCol = ({children}: { children: React.ReactNode }) => {
  return (
    <Col className="scrollable pb-4">
      {children}
    </Col>
  )
}

const Header = ({title, children}: { title: string, children: React.ReactNode }) => {
  return (
    <div className="position-sticky top-0 bg-white pt-3 pb-2 d-flex align-items-center">
      <h1 className="me-auto my-auto">{title}</h1>
      {children}
    </div>
  );
};

const Body = ({children}: { children: React.ReactNode }) => {
  return <>{children}</>;
}

ScrollableCol.Header = Header;
ScrollableCol.Body = Body;