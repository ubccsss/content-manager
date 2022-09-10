export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

export const { OWNER, REPO, BASE_BRANCH } = getGithubDetails();
