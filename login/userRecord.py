#!/usr/bin/env python

from http.server import BaseHTTPRequestHandler, HTTPServer
import http.client
from user import Action


# HTTPRequestHandler class
class userHandler(BaseHTTPRequestHandler):
    # GET
    def do_GET(self):
        # Send response status code
        self.send_response(200)
        print()
        # Send headers
        self.send_header('Content-type', 'text/html')
        self.end_headers()

        #interact with db
        #
        action = self.pathParcing(self.path)
        result = Action(action).act()

        # Send message back to client
        message = str(result)
        # Write content as utf-8 data
        self.wfile.write(bytes(message, "utf8"))
        return

    def pathParcing(self,path):
        args = []
        type, paras = path[1:].split('?')
        args.append(type)
        if '&' in paras:
            usr, id = paras.split('&')
            args.extend([usr.split('=')[1], id.split('=')[1]])
        else:
            args.append(paras.split('=')[1])
            args.append(None)
        return args



def run():
    print('starting server...')

    # Server settings
    # Choose port 8080, for port 80, which is normally used for a http server, you need root access
    server_address = ('127.0.0.1', 8081)
    httpd = HTTPServer(server_address, userHandler)
    print('running server...')
    httpd.serve_forever()


run()