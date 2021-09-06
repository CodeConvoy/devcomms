// returns a new date string in yyyy-mm-dd format
export default function newDateString() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const date = new Date(now - offset);
  return JSON.stringify(date).slice(1, 11);
}
