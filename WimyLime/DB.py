#!/usr/bin/python
# -*- coding:utf-8 -*-

import webapp2
import logging
import json
import traceback
import sys
import datetime
import urllib
import cgi

from google.appengine.api import users
from google.appengine.ext import ndb

class LimeData(ndb.Model):
    lime_index = ndb.IntegerProperty()
    videoid = ndb.StringProperty()
    title = ndb.StringProperty()
    author = ndb.StringProperty()
    notes = ndb.StringProperty()
    end_second = ndb.StringProperty()
    
    insert_time = ndb.DateTimeProperty(auto_now_add=True)

    @classmethod
    def query_limedata(cls, videoid):
        return cls.query(LimeData.videoid == videoid)
    
class insertLime(webapp2.RequestHandler):

    def getNewIndex(self):
        queryResult = LimeData.query(LimeData.lime_index >= 0).order(-LimeData.lime_index)
        
        if queryResult == None:
            logging.info("here1")
            return 0,0
        
        fetchResult = queryResult.fetch(5000)
        
        if fetchResult == None:
            logging.info("here2")
            return 0,0
        
        listCount = len(fetchResult)
        if listCount == 0:
            logging.info("here3")
            return 0,0
        
        newIndex = fetchResult[0].lime_index + 1 
        return newIndex, listCount
    
    def post(self):
        
        args = self.request.arguments()
        
        logging.info(args)
        
        videoid = self.request.get("videoid")
        videotitle = self.request.get("videotitle")
        author = self.request.get("author")
        notes = self.request.get("notes")
        end_second = self.request.get("end_second")
        
        newIndex, listCount = self.getNewIndex()

        logging.info("New lime_index : %d, listCount : %d" % (newIndex, listCount))

        newLime = LimeData(lime_index = newIndex, author = author, videoid = videoid, title = videotitle, notes = notes, end_second = end_second)
        newLime.put()
        
        self.response.out.write("<html><body>ok : <a href='player.htm?lime_index=" + str(newIndex) + "'>Go to play</a><br /><a href='list.htm'>List limes</a></body></html>")

class listLime(webapp2.RequestHandler):
    
    def get(self):
        
        videoid = self.request.get("videoid")
        
        if videoid == "":
            queryResult = LimeData.query().order(LimeData.insert_time)
            logging.info("get all")
        else:
            queryResult = LimeData.query_limedata(videoid).order(LimeData.insert_time)
        
        result = []
        
        for list in queryResult.iter():
            
            thisItem = {}
            thisItem["index"] = list.lime_index
            thisItem["title"] = list.title
            thisItem["author"] = list.author
            
            result.append(thisItem)
            
        self.response.write(json.dumps(result))

class loadLime(webapp2.RequestHandler):
    
    def get(self):
        
        lime_index = self.request.get("lime_index")
        
        queryResult = LimeData.query(LimeData.lime_index == int(lime_index))
        
        result = {}
        
        for list in queryResult.iter():
            #self.response.write(list.notes + "<br/>")
            result["notes"] = list.notes
            result["videoid"] = list.videoid
            result["end_second"] = list.end_second
            break
        
        self.response.write(json.dumps(result))



app = webapp2.WSGIApplication([
                                ('/insertLime.py', insertLime)
                                , ('/listLime.py', listLime)
                                , ('/loadLime.py', loadLime)
                               ], debug=True)
