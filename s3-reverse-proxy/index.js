const express = require('express');
const httpProxy = require('http-proxy');

const app = express();

const PORT = 8000;

const BASE_PATH = 'https://vercel-clone-personal-project.s3.ap-south-1.amazonaws.com/__output';

const proxy = httpProxy.createProxy();

app.listen(PORT, () => {
    console.log(`Reverse Proxy Running at port ${PORT}`);
})

app.use((req, res) => {
    const hostname = req.hostname;

    const subdomain = hostname.split('.')[0];

    const resolveTo = `${BASE_PATH}/${subdomain}`

    return proxy.web(req, res, {target : resolveTo, changeOrigin : true});
});

proxy.on('proxyReq', (proxyReq, req, res) => {                           //event handler
    const url = req.url;
    if (url == '/'){
        proxyReq.path += 'index.html';
    }
})