const {exec} = require('child_process');       // create a thread and execute thread using terminal commands
const path = require('path');
const fs = require('fs');
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
const mime = require('mime-types');
const Redis = require('ioredis');

const publisher = new Redis('');

const s3Client = new S3Client({
    region: '',
    credentials: {
        accessKeyId: '',
        secretAccessKey: ''
    }
});

const PROJECT_ID = process.env.PROJECT_ID;

function publishLog(log){
    publisher.publish(`logs : ${PROJECT_ID}`, JSON.stringify(log));               //here `logs : projectID` is the channel name in redis to which this message is published to.
}
 
async function init() {
    console.log('Executing script.js, the code has been cloned from git and put into home/app/output directory.');
    publishLog('Build started...');
    const outDirPath = path.join(__dirname, 'output');
    console.log(outDirPath);

    const p = exec(`cd ${outDirPath} && npm install && npm run build`);
    
    p.stdout.on('data', function(data){
        console.log(data.toString());
        publishLog(data.toString());
    });

    p.stdout.on('error', function(data){
        console.log(error.toString());
        publishLog(`error : ${data.toString()}`);
    });

    p.on('close', async function(){
        console.log('Contents of output directory:', fs.readdirSync(outDirPath));

        console.log("npm build is complete, i.e all the dist/ files are formed now");
        publishLog('Build complete...');
        const distFolderPath = path.join(__dirname, 'output', 'dist');
        console.log("Error T2: ", distFolderPath)
        const distFolderContents = fs.readdirSync(distFolderPath, {recursive : true});

        publishLog('Uploading to s3...');
        for(const file of distFolderContents){
            const filePath = path.join(distFolderPath, file);
            if(fs.lstatSync(filePath).isDirectory()){
                continue;
            } 
            
            console.log("Uploading ", filePath, " into s3");
            publishLog(`Uploading file ${file} to s3`);
            const command = new PutObjectCommand({
                Bucket: 'vercel-clone-personal-project',
                Key: `__output/${PROJECT_ID}/${file}`,                          // path at which project with id "projectid" is stored in s3.
                Body: fs.createReadStream(filePath),                                // reads the actual content of the file.
                ContentType: mime.lookup(filePath)
            });

            await s3Client.send(command);
            console.log('Just finished uploading dist/ files into s3');
            publishLog(`Uploaded file ${file} to s3`);
        }
        console.log('all dist/ files of this particular project has been uploaded to S3')
        publishLog('Finished uploading all files to s3');
    })
}

init()