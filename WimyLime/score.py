#!/usr/bin/python
# -*- coding:utf-8 -*-

import webapp2
import logging

from google.appengine.ext import ndb

class score(webapp2.RequestHandler):

    def get(self, key):
        return self.request.get(key)

    def getRank(self, totalNoteCount, hitNoteCount):
        
        rate = int(hitNoteCount) * 100 / int(totalNoteCount)
        
        if rate >= 99:
            return "AAA"
        
        if rate >= 90:
            return "A"
        
        if rate >= 70:
            return "B"
        
        if rate >= 60:
            return "C"
        
        return "F"
        
    def post(self):
        
        args = self.request.arguments()
        
        logging.info(args)
        
        videoid = self.request.get("videoid")
        totalNotes = self.request.get("totalNotes")
        maxCombo = self.request.get("maxCombo")
        miss = self.request.get("miss")
        lime_index = self.request.get("lime_index") 
        
        resultMsg = "FAILED"
        
        if self.get("clear") == "cleared":
            resultMsg = "CLEARED"
        
        additional = ""
        
        if miss == "0":
            additional = "- PERFECT -"

        rank = self.getRank(totalNotes, self.get("hit"))
        
        self.response.out.write("""
<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="target-densitydpi=device-dpi, width=device-width, user-scalable=no" />
    <title>WimeLime - Rhythm Action with YouTube</title>

    <link href="style.css" rel="stylesheet" type="text/css" />
    
    <script src="http://www.google.com/jsapi" type="text/javascript"></script>
    <script src="util.js" type="text/javascript"></script>
    <script src="game_common.js" type="text/javascript"></script>
    <script src="findImage.js"></script>

</head>
<body id="mainBody" onload="requestBackgroundImage('""" + videoid + """');">
    <div id="result_main">
        <div id="main_head">
            <span class="mainlogo">""" + resultMsg + """</span>
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
                    <th  class="result_header">TOTAL NOTE</td>
                    <td class="result_data">""" + totalNotes + """</td>
                </tr>
                <tr>
                    <th  class="result_header">MAX COMBO</td>
                    <td class="result_data">""" + maxCombo + """</td>
                </tr>
                <tr>
                    <th  class="result_header">HIT</td>
                    <td class="result_data">""" + self.get("hit") + """</td>
                </tr>
                <tr>
                    <th  class="result_header">BREAK</td>
                    <td class="result_data">""" + miss + """</td>
                </tr>
                <tr>
                    <th  class="result_header">RANK</td>
                    <td class="result_data">""" + rank + """</td>
                </tr>
                <tr>
                    <td colspan="2"><hr /></td>
                </tr>
                <tr>
                    <th  class="result_score_header">Score</td>
                    <td class="result_score_data">""" + self.get("score") + """</td>
                </tr>
                <tr>
                    <td colspan="2" class="result_additional">""" + additional + """</td>
                </tr>
            </table>
            <br />
            <span id="result_play_again"><a href='/list.htm'><span id="result_play_again">SELECT MUSIC</span></a></span>
            <span id="result_play_again"><a href='/player.htm?lime_index=""" + lime_index + """' ><span id="result_play_again">PLAY AGAIN</span></a></span>
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
