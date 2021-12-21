const { writeFileSync } = require('fs');

const watchHistory = require('./watch-history.json');

const viewHistory = watchHistory.filter(({ subtitles: s }) => s && s.length === 1);

const channelObj = {};

viewHistory.forEach(({
  subtitles, title, titleUrl, time,
}) => {
  const { name, url } = subtitles[0];
  if (!channelObj[url]) {
    channelObj[url] = {
      channel: name,
      titles: {},
    };
  }

  if (channelObj[url].titles[titleUrl]) {
    channelObj[url].titles[titleUrl].times.push(time);
  } else {
    channelObj[url].titles[titleUrl] = {
      title,
      times: [time],
    };
  }
});

const channels = Object.entries(channelObj).map((channelEntry) => ({
  ...channelEntry[1],
  channelUrl: channelEntry[0],
  titles: Object.entries(channelEntry[1].titles).map((titleEntry) => ({
    ...titleEntry[1],
    title: titleEntry[1].title.slice(8),
    titleUrl: titleEntry[0],
    get titleViews() {
      return this.times.length;
    },
  })),
  get channelViews() {
    return this.titles.reduce((acc, e) => acc + e.titleViews, 0);
  },
})).sort((a, b) => b.channelViews - a.channelViews);

writeFileSync('channels.json', JSON.stringify(channels));
