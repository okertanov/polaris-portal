FROM node:12.11.1-alpine as build-step
RUN mkdir -p /app
WORKDIR /app
COPY . /app

# Need to set unsafe-perm so that npm runs lifecycle scripts https://stackoverflow.com/a/66222294/1860900
RUN npm set unsafe-perm true

RUN npm install
RUN npm run build

FROM nginx:1.21
RUN rm -rf /usr/share/nginx/html/* && rm -rf /etc/nginx/nginx.conf
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build-step /app/dist/dvita /usr/share/nginx/html
EXPOSE 4200:80
