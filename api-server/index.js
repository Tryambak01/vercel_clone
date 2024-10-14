const express = require('express');
const { generateSlug } = require('random-word-slugs');
const {ECSClient, RunTaskCommand} = require('@aws-sdk/client-ecs');
const Redis = require('ioredis');
const { Server } = require('socket.io');

const app = express();
const PORT = 9000;

const subscriber = new Redis('');

const io = new Server({ cors:'*' });

io.listen(9002, () => console.log('Socket server started on port 9002'));

io.on('connection', socket => {
    socket.on('subscribe', channel => {
        socket.join(channel);
        socket.emit('message', `Joined ${channel}`);
    });
});

const ecsCleint = new ECSClient({
    credentials : {
        region: '',
        accessKeyId : '',
        secretAccessKey : ''
    }
});

const config = {
    CLUSTER : '',
    TASK : '' 
};

app.use(express.json());

app.post('/project', async (req, res) => {
    const { gitURL, slug } = req.body;
    const projectSlug = slug ? slug : generateSlug();

    // Run or Spin the container through amazon ecs cluster.
    const command = new RunTaskCommand({
        cluster : config.CLUSTER,
        taskDefinition : config.TASK,
        launchType : 'FARGATE',
        count : 1,
        networkConfiguration : {
            awsvpcConfiguration : {
                assignPublicIp : 'ENABLED',
                subnets : ['', '', ''],
                securityGroups : ['']
            }
        },
        overrides : {
            containerOverrides : [
                {
                    name : 'builder-image',
                    environment : [
                        {name : 'GIT_REPOSITORY_URL', value : gitURL},
                        {name : 'PROJECT_ID', value : projectSlug}
                    ]
                }
            ]
        }
    });

    await ecsCleint.send(command);

    return res.json({status : 'queued', data : {projectSlug, url: `http://${projectSlug}.localhost:8000`}});
});

async function initRedisSubscribe(){
    console.log('Subscribed to logs');
    subscriber.psubscribe('logs*');
    subscriber.on('pmessage', (pattern, channel, message) => {
        io.to(channel).emit('message', message);
    });
};

initRedisSubscribe()

app.listen(PORT, () => {
    console.log(`API server is running at port ${PORT}`)
});