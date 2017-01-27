# Introduction

The server uses Flask framework.

In order to run the server: you need to install gunicorn and Flask

```$ pip install flask gunicorn```

## How to run the server
Enter the server directory and use

```$ gunicorn -D -w 4 -b 0.0.0.0:5000 myapp:app```

to run the server

## How to stop the server

```$ ps ax | grep gunicorn```

to find the \<pid\> of gunicorn

```$ kill <pid>```

to stop the gunicorn

