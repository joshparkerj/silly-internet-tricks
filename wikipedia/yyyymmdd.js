export default function yyyymmdd(date) {
  const isoString = date.toISOString();
  const isoRe = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})T\d\d:\d\d:\d\d.\d{3}Z/;
  const isoMatch = isoString.match(isoRe);
  const { year, month, day } = isoMatch.groups;
  return `${year}${month}${day}`;
}
