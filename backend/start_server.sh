#!/bin/bash
gunicorn -w 10 -D myapp:app -b 0.0.0.0:5000 --access-logfile backend.log
