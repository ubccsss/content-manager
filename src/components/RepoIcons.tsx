import {Box, Github} from 'react-bootstrap-icons';
import "./RepoIcons.module.css";

export const RepoIcons = () => {
  return (
    <div className="float-end pt-lg-2">
      <a href="https://github.com/ubccsss/content-manager" target="_blank" rel="noreferrer" className="pe-3">
        <Github size={32}/>
      </a>
      <a href="https://github.com/ubccsss/ubccsss.org" target="_blank" rel="noreferrer">
        <Box size={32}/>
      </a>
    </div>
  );
}