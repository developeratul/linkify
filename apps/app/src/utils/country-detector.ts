import moment from "moment-timezone/data/meta/latest.json";

const timeZoneToCountry: Record<string, string> = {};

Object.keys(moment.zones).forEach((z) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  timeZoneToCountry[z] = moment.countries[moment.zones[z].countries[0]].abbr; // BD, EN-GB
});

export function detectCountry() {
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
  const country = timeZoneToCountry[timeZone];
  return country;
}
