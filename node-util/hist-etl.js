/* eslint-disable no-unused-vars */
const channelObj = {};
const watchHistoryFilter = (e) => e.subtitles && e.subtitles.length === 1;
const addToChannelObj = ({
  subtitles, title, titleUrl, time,
}) => {
  const { url } = subtitles[0];
  if (channelObj[url].titles[titleUrl]) channelObj[url].titles[titleUrl].times.push(time);
  else channelObj[url].titles[titleUrl] = { title, times: [time] };
};
