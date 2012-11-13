#!/usr/bin/python
# -*- coding:utf-8 -*-

import webapp2
import logging

from google.appengine.ext import ndb

class score(webapp2.RequestHandler):

    def post(self):
        
        args = self.request.arguments()
        
        logging.info(args)
        
        videoid = self.request.get("videoid")
        totalNotes = self.request.get("totalNotes")
        maxCombo = self.request.get("maxCombo")
        miss = self.request.get("miss")
        lime_index = self.request.get("lime_index") 
        
        self.response.out.write("""
<html>
<head>
    <link href='http://fonts.googleapis.com/css?family=Audiowide' rel='stylesheet' type='text/css'>
    <link href="style.css" rel="stylesheet" type="text/css" />
    
    <script src="http://www.google.com/jsapi" type="text/javascript"></script>
    <script src="util.js" type="text/javascript"></script>
    <script src="game_common.js" type="text/javascript"></script>
    <script src="findImage.js"></script>

</head>
<body id="mainBody" onload="requestBackgroundImage('""" + videoid + """');">
    <div id="indexmain" style="background-color:black">
        <div id="main_head">
            <span class="mainlogo">RESULT</span>
            <br /><br />
            <div id="main_menu">
                <a href='/'>Home</a>
                &nbsp;&nbsp;
                <a href='/startRecord.htm'>Create</a>
                &nbsp;&nbsp;
                <a href='/list.htm'>Play</a>
            </div>
        </div>
        <div id="main_inner">
            <br />
            <br />
            <table id="result_table">
                <tr>
                    <th  class="result_header">Total Notes</td>
                    <td class="result_data">""" + totalNotes + """</td>
                </tr>
                <tr>
                    <th  class="result_header">Max Combo</td>
                    <td class="result_data">""" + maxCombo + """</td>
                </tr>
                <tr>
                    <th  class="result_header">Miss</td>
                    <td class="result_data">""" + miss + """</td>
                </tr>
            </table>
            
            <div id="result_play_again">
                <a href='/player.htm?lime_index=""" + lime_index + """' ><span id="result_play_again">Play Again</span></a>
            </div>
        </div>
    </div>
    <br />
    <div id="footer">
    Made by zelon
    </div>
</body>
</html>"""
            )

app = webapp2.WSGIApplication([
                                ('/score.py', score)
                               ], debug=True)
