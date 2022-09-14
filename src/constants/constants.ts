// return GitHub details based on whether the environment is production or development
const getGithubDetails = () => {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    return {
      OWNER: "csssbot",
      REPO: "testing",
      BASE_BRANCH: "main"
    };
  } else {
    return {
      OWNER: "ubccsss",
      REPO: "ubccsss.org",
      BASE_BRANCH: "master"
    };
  }
}

export const LABEL = "create event";

export const { OWNER, REPO, BASE_BRANCH } = getGithubDetails();
