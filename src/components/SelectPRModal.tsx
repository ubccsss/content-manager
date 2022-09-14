import {ListGroup, Modal} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {useDispatch} from "../contexts/contexts";
import {Icon} from "./Icon";
import {compareBranches, ListPrResponseDataType, listPRs} from "../api/github";
import {LABEL} from "../constants/constants";
import {updateForm} from "../reducers/FormActions";
import {updateAlert} from "../reducers/AlertActions";
import {AlertData} from "../reducers/AlertReducer";
import {updatePrefixDate} from "../reducers/PreferencesActions";
import {updatePRDetails} from "../reducers/GitActions";

export const SelectPRModal = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dispatch = useDispatch();

  const [prs, setPRs] = useState<ListPrResponseDataType>([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getPrs = async (): Promise<ListPrResponseDataType> => {
      return await listPRs();
    }
    getPrs().then((prs) => {
      setPRs(prs);
    });
  }, [])

  const handleSelectPR = async (baseRef: string, headRef: string, lastCommitSha: string, prNumber: number) => {
    try {
      const comparison = await compareBranches(baseRef, headRef);
      const lastTreeSha = comparison.commits.find((commit) => commit.sha === lastCommitSha)?.commit.tree.sha;
      if (!lastTreeSha) {
        throw new Error('Could not find tree hash for last commit. Did you recently make a change? The API can take some time to reflect changes.');
      }
      dispatch(updatePrefixDate(false));
      dispatch(await updateForm(baseRef, headRef));
      dispatch(updatePRDetails({
        prExists: true,
        branchRef: headRef,
        lastCommitSha,
        lastTreeSha,
        prNumber: prNumber
      }))
      handleClose();
    } catch (e) {
      console.error(e);
      const message = e instanceof Error ? e.message : String(e)
      dispatch(updateAlert({
        show: true,
        message: `Error fetching files: <b><i>${message}</i></b> <br/>`,
        variant: 'danger',
      } as AlertData))
    }
  }

  const renderBodyAndFooter = () => {
    const prsList: JSX.Element[] = [];
    prs.forEach((pr) => {
      if (pr.labels.find((label) => label.name === LABEL)) {
        const lastUpdated = new Date(pr.created_at);
        const lastUpdatedString = lastUpdated.toLocaleString();
        prsList.push(
          <ListGroup.Item key={pr.id} disabled={isLoading}>
            <div className="d-flex justify-content-between">
              <div>
                <h6>
                  <a href={pr.html_url} target="_blank" rel="noreferrer">{pr.title}
                    {`${pr.title} #${pr.number}`}
                  </a>
                </h6>
                <p>Created at: {lastUpdatedString}</p>
              </div>
              <div>
                <Icon iconName="ArrowRight" size={24} onClick={async () => {
                  setIsLoading(true);
                  await handleSelectPR(pr.base.ref, pr.head.ref, pr.head.sha, pr.number)
                  setIsLoading(false);
                }}/>
              </div>
            </div>
          </ListGroup.Item>
        )
      }
    })

    if (prsList.length === 0) {
      return (
        <Modal.Body>
          <p className="text-center pt-2">No PRs with <code>{LABEL}</code> label found</p>
        </Modal.Body>
      )
    } else {
      return (
        <>
          <Modal.Body className="p-0">
            <ListGroup>
              {prsList}
            </ListGroup>
          </Modal.Body>
          <Modal.Footer>
            <i><small>Click the arrow to load the PR</small></i>
          </Modal.Footer>
        </>
      )
    }
  }

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        keyboard={true}
        centered
        scrollable={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Select PR to Edit
          </Modal.Title>
        </Modal.Header>
        {renderBodyAndFooter()}
      </Modal>

      <Icon iconName="Git" size={24} onClick={handleShow}/>
    </>
  )
}
