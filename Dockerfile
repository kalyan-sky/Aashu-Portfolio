# Static site (plain HTML/CSS/JS, no build step) served via nginx on Cloud Run.
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html

# COPY preserves source file permissions, which can be more restrictive than
# nginx's non-root worker process can read (seen in the wild: 600 on the
# video/PDF assets in this repo, checked out from a source that used a
# restrictive umask) — normalize everything to world-readable regardless.
RUN chmod -R a+rX /usr/share/nginx/html

EXPOSE 8080
