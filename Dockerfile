FROM ubuntu:latest
LABEL authors="arsenijsnitko"

ENTRYPOINT ["top", "-b"]