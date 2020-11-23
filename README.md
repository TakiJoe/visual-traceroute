# Visual Traceroute
<img width="100%" alt="Visual Traceroute" src="https://user-images.githubusercontent.com/14234849/99977154-92759d00-2da4-11eb-8443-16b48277f3b7.png">

This is a simple visual traceroute app written in javascript that runs in
the browser. The traceroute part written using nodejs runs as a local web
server that uses a web socket to stream locational info related to each hop
reached during the traceroute. To obtain locational info about each hop the
ip-api.com web service is queried using the hops IP address. This hop 
info is then sent to the browser where it is displayed on a table as well as
drawn on a map.


## Dependencies
* [traceroute](https://man7.org/linux/man-pages/man8/traceroute.8.html)
* [Node.js](https://nodejs.org)
* [ws](https://www.npmjs.com/package/ws)
* [nodejs-traceroute](https://www.npmjs.com/package/nodejs-traceroute)
* [Leaflet](https://leafletjs.com)
* [jQuery](https://jquery.com)
* [Bootstrap](https://getbootstrap.com)


## Usage
### Run with Node.js
Requires `traceroute` installed on your system.
```
git clone git clone https://github.com/belkone/visual-traceroute.git
cd visual-traceroute
npm install
node trace.js
```
### Run with Docker
On Linux hosts it is suggested to use the [host networking](https://docs.docker.com/network/host/).
```
docker run --rm -d -p 8080:8080 --name visual-traceroute belkone/visual-traceroute
```

## Notes

[ip-api.com](https://ip-api.com) in free plan their endpoints are limited to 45 HTTP requests per minute from an IP address.