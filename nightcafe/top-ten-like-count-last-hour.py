from urllib.request import urlopen
from html.parser import HTMLParser
from json import dumps, loads, JSONDecodeError
from re import search, sub
from datetime import datetime

class MyHTMLParser(HTMLParser):
    def __init__(self):
      HTMLParser.__init__(self)
      self.get_data = False

    def handle_starttag(self, tag, attrs):
      if tag == 'script' and len(attrs) > 0 and attrs[0] == ('id', '__NEXT_DATA__'):
        self.get_data = True
    
    def handle_data(self, data):
      if self.get_data:
        retrieved = datetime.now()
        try:
          cleaned_data = sub(r'\\x[\da-f]{2}', '', data.replace('\\\\"', '\\"').replace('\\\'', '\''))
          loaded_data = loads(cleaned_data)
          server_jobs = loaded_data['props']['pageProps']['serverJobs']
          with open('./top-ten-log.csv', 'a') as f:
            for job in server_jobs:
              try:
                title = job['title']
                username = job['userInfo']['username']
                url = job['path'].replace('/jobs', 'https://creator.nightcafe.studio/creation')
                num_likes = job['likesMeta']['numLikes']
                created = datetime.fromtimestamp(int(job['created']) / 1000)
                posted_date = datetime.fromtimestamp(int(job['postedDate']) / 1000)
                row = f'"{title}","{username}","{url}","{num_likes}","{created}","{posted_date}","{retrieved}"\n'
                f.write(row)
              except KeyError as ke:
                print(ke)
          print(len(server_jobs))
        except JSONDecodeError as err:
          print(err)
          char_index = int(search(r'\(char (\d+)\)', str(err)).group(1))
          print(char_index)
          print(cleaned_data[char_index-20:char_index+30])
        self.get_data = False

content = str(urlopen('https://creator.nightcafe.studio/explore').read())

parser = MyHTMLParser()
parser.feed(content)
