import {getCurrentDate, readFile} from "./utils";
import {FormFields} from "../reducers/FormReducer";
import {Octokit} from "@octokit/rest";
import {BASE_BRANCH, OWNER, REPO} from "../constants/constants";
import {Buffer} from "buffer";
import {OctokitResponse} from "@octokit/types";

// returns new branch name
const getNewBranchName = () => {
  return `new-event-${Date.now()}`;
}

// returns file name for event
const getEventFileName = (title: string) => {
  return `${getCurrentDate()}-${title.trim().toLowerCase().replaceAll(" ", "-")}.md`;
}

// returns path for event file
const getEventPath = (title: string) => {
  return `content/events/${getEventFileName(title)}`;
}

// returns content for event file
const getNewEventFileContent = (state: FormFields) => {
  const {body, categories, previewImage, startDate, startTime, endDate, endTime, tags, title, author} = state;
  return (
    `---
# The title of the event
title: ${title}
# Publishing date when the event appears, not the date of the event.
date: ${getCurrentDate()}
# Tags that apply to the event
tags: [${tags}]
categories: [${categories}]
# Name of the author (you)
author: ${author}
# Images associated to this event. Used for banner.
images:
  - /files/${previewImage ? previewImage[0].name : ""}
# Start date and time. Used for calendar page.
start_date: ${startDate} ${startTime}
# End date and time (defaults to one hour after start). Used for calendar page.
end_date: ${endDate} ${endTime}
---

${body}
`
  );
}

// Creates a new branch and commits the new event file and images to the branch
// Then creates a pull request to merge the branch into the base branch
// Official GitHub API Docs: https://docs.github.com/en/rest
// Python reference for pushing to GitHub using the REST API: https://gist.github.com/harlantwood/2935203
// Post on committing images: https://stackoverflow.com/questions/65333387/commit-image-in-git-tree-using-the-github-api
export const createEvent = async (state: FormFields) => {
  // create new octokit instance with auth token
  const octokit = new Octokit({
    auth: process.env.REACT_APP_TOKEN
  })

  // get new branch name
  const newBranchName = getNewBranchName();

  // get ref for base branch
  const baseBranchRef = await octokit.git.getRef({
    owner: OWNER,
    repo: REPO,
    ref: `heads/${BASE_BRANCH}`
  });

  // hash of last commit on base branch
  const lastCommitSha = baseBranchRef.data.object.sha

  // make a new branch from last commit on base branch
  await octokit.rest.git.createRef({
    owner: OWNER,
    repo: REPO,
    ref: `refs/heads/${newBranchName}`,
    sha: lastCommitSha
  });

  // get tree of last commit on base branch
  const lastCommitNewBranch = await octokit.rest.git.getCommit({
    owner: OWNER,
    repo: REPO,
    commit_sha: lastCommitSha
  })

  // hash of the tree of the last commit on base branch (and also the new branch, since it's a copy)
  const lastTreeSha = lastCommitNewBranch.data.tree.sha

  // Now we want to upload the images to GitHub and get the blob hashes
  // We will use these hashes later on
  // Before uploading the images, we need to read them from the file system and convert them to base64
  let binaryImagePromises: Promise<any>[] = [];
  let imageNames: string[] = [];
  // push readFile promise for previewImage to binaryImagePromises
  if (state.previewImage) {
    binaryImagePromises.push(readFile(state.previewImage[0]));
    imageNames.push(state.previewImage[0].name);
  }
  // push readFile promise for otherImages to binaryImagePromises
  if (state.otherImages) {
    state.otherImages.forEach((file) => {
      binaryImagePromises.push(readFile(file));
      imageNames.push(file.name);
    });
  }

  // wait for all images to be read
  const images: any[] = await Promise.all(binaryImagePromises);

  const imageBlobPromises: Promise<any>[] = [];

  // for each image, convert it to base64 and push a promise to create a blob to imageBlobPromises
  images.forEach((image) => {
    const imageBuffer = Buffer.from(image, 'binary');
    const imageBase64 = imageBuffer.toString('base64');
    imageBlobPromises.push(
      octokit.rest.git.createBlob({
        owner: OWNER,
        repo: REPO,
        content: imageBase64,
        encoding: 'base64'
      })
    );
  });

  // wait for all blobs to be created
  const imageBlobs: OctokitResponse<{ url: string, sha: string }, 201>[] = await Promise.all(imageBlobPromises);

  // create a new tree with the blobs
  const treeObjects = imageBlobs.map((blob, index) => {
    return {
      path: `static/files/${imageNames[index]}`,
      mode: '100644',
      type: 'blob',
      sha: blob.data.sha
    } as any;
  });

  // create a new tree with the event file and images
  const newContentTree = await octokit.rest.git.createTree({
    owner: OWNER,
    repo: REPO,
    tree: [
      {
        path: getEventPath(state.title),
        mode: "100644",
        type: "blob",
        content: getNewEventFileContent(state)
      },
      // empty treeObjects(images) into newContentTree
      ...treeObjects
    ],
    base_tree: lastTreeSha
  })

  // hash of the new tree
  const newContentTreeSha = newContentTree.data.sha

  // create a new commit with the new tree
  const newCommit = await octokit.rest.git.createCommit({
    owner: OWNER,
    repo: REPO,
    message: `Add new event ${state.title}`,
    tree: newContentTreeSha,
    parents: [lastCommitSha]
  })

  // hash of the new commit
  const newCommitSha = newCommit.data.sha

  // update the new branch with the new commit by changing the branch's head
  await octokit.rest.git.updateRef({
    owner: OWNER,
    repo: REPO,
    ref: `heads/${newBranchName}`,
    sha: newCommitSha
  })

  // Make a PR to merge the new branch into the base branch
  const newPR = await octokit.rest.pulls.create({
    owner: OWNER,
    repo: REPO,
    title: `Added new event: ${state.title} by ${state.author}`,
    body: 'This is an auto-generated PR made using: https://github.com/ubccsss/content-manager',
    head: newBranchName,
    base: BASE_BRANCH
  })

  // return response containing new PR data
  return newPR.data;
}
