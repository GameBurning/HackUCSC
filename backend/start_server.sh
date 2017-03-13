#!/bin/bash
gunicorn -w 4 -D myapp:app -b 0.0.0.0
