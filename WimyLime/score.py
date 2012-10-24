#!/usr/bin/python
# -*- coding:utf-8 -*-

import webapp2
import logging

from google.appengine.ext import ndb

class score(webapp2.RequestHandler):

    def post(self):
        
        args = self.request.arguments()
        
        logging.info(args)
        
        totalNotes = self.request.get("totalNotes")
        maxCombo = self.request.get("maxCombo")
        miss = self.request.get("miss")
        lime_index = self.request.get("lime_index") 
        
        self.response.out.write("""
            <html>
                <body>
                <a href='/'>Home</a> <a href='/player.htm?lime_index=%s'>Play Again</a>
                <br />
                <br />
                <table>
                    <tr>
                        <th>Total Notes</td>
                        <td>%s</td>
                    </tr>
                    <tr>
                        <th>Max Combo</td>
                        <td>%s</td>
                    </tr>
                    <tr>
                        <th>Miss</td>
                        <td>%s</td>
                    </tr>
                </body>
            </html>
            """ % (lime_index, totalNotes, maxCombo, miss))

app = webapp2.WSGIApplication([
                                ('/score.py', score)
                               ], debug=True)
