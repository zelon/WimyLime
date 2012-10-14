#!/usr/bin/python
# -*- coding:utf-8 -*-

import webapp2
import logging
import json
import traceback
import sys
import datetime
import cgi

from google.appengine.api import users
from google.appengine.ext import ndb

class LimeData(ndb.Model):
    lime_index = ndb.IntegerProperty()
    videoid = ndb.StringProperty()
    author = ndb.StringProperty()
    notes = ndb.StringProperty()
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
    
    def insertNewList(self):
        
        
        logging.info("Inserted new list")
        
        return newIndex, newName

    def post(self):
        
        args = self.request.arguments()
        
        logging.info(args)
        
        videoid = self.request.get("videoid")
        author = self.request.get("author")
        notes = self.request.get("notes")
        
        newIndex, listCount = self.getNewIndex()

        logging.info("New lime_index : %d, listCount : %d" % (newIndex, listCount))

        newLime = LimeData(lime_index = newIndex, author = author, videoid = videoid, notes = notes)
        newLime.put()
        
        self.response.out.write("<html><body>ok : <a href='player.htm?lime_index=" + str(newIndex) + "'>Go to play</a></body></html>")

class listLime(webapp2.RequestHandler):
    
    def get(self):
        
        videoid = self.request.get("videoid")
        
        queryResult = LimeData.query_limedata(videoid)
        
        
        for list in queryResult.iter():
            self.response.write("<a href='player.htm?lime_index=" + str(list.lime_index) + "'>" + str(list.lime_index) +" : " + list.author + "<a/><br/>")
        

class loadLime(webapp2.RequestHandler):
    
    def get(self):
        
        lime_index = self.request.get("lime_index")
        
        queryResult = LimeData.query(LimeData.lime_index == int(lime_index))
        
        result = {}
        
        for list in queryResult.iter():
            #self.response.write(list.notes + "<br/>")
            result["notes"] = list.notes
            result["videoid"] = list.videoid
            break
        
        self.response.write(json.dumps(result))



app = webapp2.WSGIApplication([
                                ('/insertLime.py', insertLime)
                                , ('/listLime.py', listLime)
                                , ('/loadLime.py', loadLime)
                               ], debug=True)
