export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// returns current date in YYYY-MM-DD format
export const getCurrentDate = () => {
  return (new Date()).toISOString().split('T')[0];
}

// returns current date in Aug 10, 2001 format
export const getPublishDate = () => {
  const date = new Date();
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

// converts date in YYYY-MM-DD format to Aug 10, 2001 format
export const formatDate = (date: string) => {
  const parts = date.split('-');
  return parts ? `${MONTHS[Number(parts[1])]} ${parts[2]}, ${parts[0]}` : '';
}

// returns time without seconds
// REQUIRED: time is in the form of HH:MM:SS
export const getTimeWithoutSeconds = (time: string) => {
  return time.split(':').slice(0, 2).join(':');
}

export const getFullDate = (date: string, time: string) => {
  const dateObj = new Date(`${date}T${time}`);
  const month = new Intl.DateTimeFormat('en-US', {month: "long"}).format(dateObj);
  return `${DAYS_OF_WEEK[dateObj.getDay()]} ${month} ${dateObj.getDate()}, ${dateObj.getFullYear()}`
}
