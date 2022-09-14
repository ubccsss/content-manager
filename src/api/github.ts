import {getCurrentDate, getFileName, getNewEventFileContent, readFile} from "../utils";
import {Octokit} from "@octokit/rest";
import {BASE_BRANCH, LABEL, OWNER, REPO} from "../constants/constants";
import {Buffer} from "buffer";
import {AppStore} from "../contexts/contexts";
import {
  GetResponseDataTypeFromEndpointMethod,
  GetResponseTypeFromEndpointMethod,
  OctokitResponse
} from "@octokit/types";

// create new octokit instance with auth token
const octokit = new Octokit({
  auth: process.env.REACT_APP_TOKEN
})

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

// type for the pull request data returned by the GitHub API
export type ListPrResponseDataType = GetResponseDataTypeFromEndpointMethod<typeof octokit.rest.pulls.list>;

// returns available PRs for REPO
export const listPRs = async (): Promise<ListPrResponseDataType> => {
  const prs = await octokit.rest.pulls.list({
    owner: OWNER,
    repo: REPO
  })

  console.log(prs.data);
  return prs.data;
}

// returns the comparison between two branches
export const compareBranches = async (baseRef: string, headRef: string) => {
  const compare = await octokit.rest.repos.compareCommits({
    owner: OWNER,
    repo: REPO,
    base: baseRef,
    head: headRef
  });

  console.log(compare.data);
  return compare.data;
}

// type for the pull request data returned by the GitHub API
export type GetContentResponseType = GetResponseTypeFromEndpointMethod<typeof octokit.rest.repos.getContent>;

export const getContent = async (fileNames: string[], headRef: string): Promise<GetContentResponseType[]> => {
  const contentPromises: Promise<GetContentResponseType>[] = [];
  fileNames.forEach((fileName) => {
    contentPromises.push(
      octokit.rest.repos.getContent({
        owner: OWNER,
        repo: REPO,
        path: fileName,
        ref: headRef
      })
    );
  });

  return await Promise.all(contentPromises);
}

// creates a new commit with the new tree
const createNewCommit = async (message: string, newTreeSha: string, parents: string[]) => {
  const newCommit = await octokit.rest.git.createCommit({
    owner: OWNER,
    repo: REPO,
    message: message,
    tree: newTreeSha,
    parents: parents
  })

  return newCommit.data;
}

// "A branch is a Git reference that stores the new Git commit hash"
// points the branch to the new commit using the commits SHA
const updateRef = async (ref: string, sha: string) => {
  const response = await octokit.rest.git.updateRef({
    owner: OWNER,
    repo: REPO,
    ref: ref,
    sha: sha
  })

  return response.data;
}

// Creates a new branch and commits the new event file and images to the branch
// Then creates a pull request to merge the branch into the base branch
// Official GitHub API Docs: https://docs.github.com/en/rest
// Python reference for pushing to GitHub using the REST API: https://gist.github.com/harlantwood/2935203
// Post on committing images: https://stackoverflow.com/questions/65333387/commit-image-in-git-tree-using-the-github-api
export const createEvent = async (store: AppStore) => {
  const {title, author} = store.form;

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
  });

  // hash of the tree of the last commit on base branch (and also the new branch, since it's a copy)
  const lastTreeSha = lastCommitNewBranch.data.tree.sha

  // hash of the new tree
  const newContentTreeSha = await createNewTree(store, lastTreeSha);

  // create a new commit with the new tree
  const newCommit = await createNewCommit(`Add new event: ${title}`, newContentTreeSha, [lastCommitSha]);

  // hash of the new commit
  const newCommitSha = newCommit.sha

  // update the new branch with the new commit by changing the branch's head
  await updateRef(`heads/${newBranchName}`, newCommitSha);

  // make a PR to merge the new branch into the base branch
  const newPR = await octokit.rest.pulls.create({
    owner: OWNER,
    repo: REPO,
    title: `Added new event: ${title} by ${author}`,
    body: 'This is an auto-generated PR made using: https://github.com/ubccsss/content-manager',
    head: newBranchName,
    base: BASE_BRANCH
  })

  // add label to PR
  await octokit.rest.issues.addLabels({
    owner: OWNER,
    repo: REPO,
    issue_number: newPR.data.number,
    labels: [LABEL]
  })

  // return response containing new PR data
  return newPR.data;
}

// Creates a new tree with the new event file and images
// Commits the new tree to the existing branch
// Updates the branch's head to point to the new commit
// Returns the updated details which should be dispatched to the store
export const updateEvent = async (store: AppStore) => {
  const {branchRef, lastTreeSha, lastCommitSha, prNumber} = store.git;

  // hash of the new tree
  const newContentTreeSha = await createNewTree(store, lastTreeSha);

  // create a new commit with the new tree
  const newCommit = await createNewCommit(`Updated event`, newContentTreeSha, [lastCommitSha]);

  // hash of the new commit
  const newCommitSha = newCommit.sha

  // update the new branch with the new commit
  await updateRef(`heads/${branchRef}`, newCommitSha);

  const updatedPR = await octokit.rest.pulls.get({
    owner: OWNER,
    repo: REPO,
    pull_number: prNumber
  });

  return {
    data: updatedPR.data,
    branchRef: branchRef,
    lastCommitSha: newCommitSha,
    lastTreeSha: newContentTreeSha,
    prNumber: updatedPR.data.number
  };
}

// Reads images from the file system and convert them to base64
// Uploads the images to GitHub and gets the blobs
// Creates a new tree with the blobs and the event file
// Returns the hash of the new tree
const createNewTree = async (store: AppStore, lastTreeSha: string) => {
  const {form} = store;
  const {title, previewImage, otherImages} = form;

  let binaryImagePromises: Promise<any>[] = [];
  let imageNames: string[] = [];
  // push readFile promise for previewImage to binaryImagePromises
  if (previewImage) {
    binaryImagePromises.push(readFile(previewImage[0]));
    imageNames.push(previewImage[0].name);
  }
  // push readFile promise for otherImages to binaryImagePromises
  if (otherImages) {
    otherImages.forEach((file) => {
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
      path: `static${getFileName(imageNames[index], store.preferences.prefixDate)}`,
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
        path: getEventPath(title),
        mode: "100644",
        type: "blob",
        content: getNewEventFileContent(store)
      },
      // empty treeObjects(images) into newContentTree
      ...treeObjects
    ],
    base_tree: lastTreeSha
  })

  // hash of the new tree
  return newContentTree.data.sha
}
