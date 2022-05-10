const express = require('express')
const process = require('process');
const proxy = require('express-http-proxy');
const spawn = require('child_process').spawn;
const app = express();
require('dotenv').config();

app.get('/audio', async (req, res) => {
    const seconds = Math.floor(Math.random() * 180);
    const ffmpeg = spawn('ffmpeg', [
        '-f', 'lavfi',
        '-i', 'anullsrc=r=44100:cl=mono',
        '-t', seconds,
        '-b:a', '32k',
        '-acodec', 'libmp3lame',
        '-f', 'mp3',
        '-y', 'tmp.mp3'
    ]);
    res.sendFile('tmp.mp3', { root: __dirname })
})

app.use('/youtube', proxy('https://www.googleapis.com/youtube/v3/', {
    proxyReqPathResolver: function (req) {
        const params = new URLSearchParams(req.query)
        params.set('key', process.env['YOUTUBE_API_KEY'])
        return '/youtube/v3' + req.url.split('?')[0] + '?' + params.toString();
    },
    preserveHostHdr: false,
}));

app.listen(3000);