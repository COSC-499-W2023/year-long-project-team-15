const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const Jimp = require('jimp');

exports.handler = async function (event) {
    console.log('Received S3 event:', JSON.stringify(event, null, 2));
    const sourceBucket = event.Records[0].s3.bucket.name;
    const key = event.Records[0].s3.object.key;
    console.log(`Source Bucket: ${sourceBucket}`, `Key: ${key}`);

    try {
        // Step 1: Detect faces using Rekognition
        const rekognition = new AWS.Rekognition();
        const params = {
            Image: {
                S3Object: {
                    Bucket: sourceBucket,
                    Name: key
                }
            }
        };

        const faceData = await rekognition.detectFaces(params).promise();
        console.log('Detected faces:', faceData);

        // Step 2: Download the image
        const originalImage = await s3.getObject({ Bucket: sourceBucket, Key: key }).promise();
        const image = await Jimp.read(originalImage.Body);

        // Step 3: Blur faces
        await Promise.all(faceData.FaceDetails.map(async (face) => {
            const box = face.BoundingBox;
            const x = Math.round(box.Left * image.bitmap.width);
            const y = Math.round(box.Top * image.bitmap.height);
            const w = Math.round(box.Width * image.bitmap.width);
            const h = Math.round(box.Height * image.bitmap.height);
            const cropped = image.clone().crop(x, y, w, h).blur(20);
            return image.composite(cropped, x, y);
        }));

        // Step 4: Get buffer of the processed image
        const processedImage = await image.getBufferAsync(Jimp.MIME_JPEG);

        // Step 5: Upload the processed image back to S3
        const targetBucket = 'blurvid-photos'; // Your target bucket
        const processedKey = key;
        await s3.putObject({
            Bucket: targetBucket,
            Key: processedKey,
            Body: processedImage,
            ContentType: 'image/jpeg'
        }).promise();

        console.log(`Processed image uploaded to ${targetBucket}/${processedKey}`);
    } catch (error) {
        console.error('Error processing image:', error);
        throw error;
    }
};
