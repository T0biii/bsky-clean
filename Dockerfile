FROM oven/bun:latest

ENV identifier 
ENV password
ENV server=bsky.social

COPY package.json ./
COPY bun.lockb ./
COPY src ./

RUN bun install
CMD bun start $identifier $password $server
