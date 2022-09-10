import Button from 'react-bootstrap/Button';
import * as icons from 'react-bootstrap-icons';
import React from "react";
import {ButtonVariant} from "react-bootstrap/types";

interface BootstrapIconProps extends React.SVGAttributes<SVGElement> {
  size?: string | number;
}

interface IconProps extends BootstrapIconProps {
  variant?: ButtonVariant;
  iconName: keyof typeof icons;
  buttonClassName?: string;
  href?: string;
  onClick?: () => void;
}

export const Icon = ({variant = "icon", iconName, href, onClick, buttonClassName, ...props}: IconProps) => {
  const BootstrapIcon = icons[iconName];
  const linkProps = href ? {href, target: "_blank", rel: "noreferrer"} : null;
  return (
    <Button variant={variant} className={buttonClassName} onClick={onClick} {...linkProps} >
      <BootstrapIcon {...props} />
    </Button>
  );
}
