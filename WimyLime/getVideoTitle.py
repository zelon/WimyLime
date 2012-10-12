#!/usr/bin/python
# -*- coding:utf-8 -*-
import re
import webapp2
import json
import logging
from google.appengine.api import urlfetch
from google.appengine.api import memcache

#exceptWords = ["
searchSite = "http://www.inmuz.com/"

url = "undefined url"
regTitle = "undefined reg"
regArtist = "undefined reg"
source = "unknown"
defaultExpireSeconds = 60*60*48

class MainPage(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/html; charset=UTF-8'
        #self.response.headers['Content-Encoding'] = 'utf-8'
        #self.response.out.write('startiing search...')

        self.searchLyrics(self.request.get("videoid"))

    def onRecvLyricsContent(self, videoID, title):
        
        videoInfo = { "videoID" : videoID, "title" : title }
        self.response.out.write(json.dumps(videoInfo))
    
    def searchLyrics(self, videoID):
        #self.response.out.write("url : " + url)
        
        if videoID == "":
            self.response.out.write("no request".encode("utf-8"))
            return
        
        cachedData = memcache.get(videoID)
        
        if cachedData is not None:
            logging.info("cache hit")
            self.onRecvLyricsContent(videoID, cachedData)
            
            return
        
        else:
            logging.info("cache miss")
        
        fetchingUrl = "http://gdata.youtube.com/feeds/api/videos/" + videoID;
        result = urlfetch.fetch(fetchingUrl)
        
        if result.status_code == 200:
            title = self.onSuccess(result.content)
            
            logging.info("adding lyrics result to memcache...")
            if not memcache.add(videoID, title, defaultExpireSeconds):
                logging.error("Adding lyrics result to memcache failed")
            else:
                logging.info("Successfully added lyrics result to memcache")

            self.onRecvLyricsContent(videoID, title)
            

    def onSuccess(self, content):
        #data = unicode(content, "utf-8", "ignore").encode("utf-8")
        #self.response.out.write(content.decode("euc-kr").encode("utf-8", errors='replace'))
        #self.response.out.write(content)
        
        d = self.getMatches("<title.*?>(.*?)</title>", content)
        #d = self.getMatches("BeforeDocument.*", content)
        
        for r in d:
            return r

        return "No result"

    def getMatches(self,regEx, regData):
        ret = []
    
        m = re.findall(regEx, regData, re.S)
        
        i = 0
        if m:
            for a in m:
                ret.append(a)
    
        return ret        
        

app = webapp2.WSGIApplication([('/getVideoTitle.py', MainPage)], debug=True)

