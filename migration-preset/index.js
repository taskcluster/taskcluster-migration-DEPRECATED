'use strict';

const preset = require('neutrino-preset-react');
const HtmlPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

preset.module.loaders.push({
  test: /\.yml$/,
  include: path.resolve(__dirname, '..', 'workgraph'),
  loaders: ['json', path.resolve(__dirname, 'loader.js')],
});

/* set up S3 publishing, if it's desired */
if (process.env.PUBLISH_BUCKET) {
  const request = require('sync-request');
  const S3Plugin = require('webpack-s3-plugin');

  if (!process.env.TASK_ID) {
    throw new Error("publishing must take place in a task");
  }

  const region = process.env.PUBLISH_REGION;
  if (!region) {
    throw new Error("set PUBLISH_REGION");
  }

  const bucket = process.env.PUBLISH_BUCKET;
  if (!bucket) {
    throw new Error("set PUBLISH_BUCKET");
  }

  // get credentials
  const response = request(
      'GET',
      'http://taskcluster/auth/v1/aws/s3/read-write/' + bucket + '/');
  if (response.statusCode != 200) {
    throw new Error(response.getBody());
  }
  const creds = JSON.parse(response.getBody()).credentials;
  console.error("AWS credentials for " + bucket + " downloaded; accessKeyId is " + creds.accessKeyId);

  preset.plugins.push(new S3Plugin({
    s3Options: {
      accessKeyId: creds.accessKeyId,
      secretAccessKey: creds.secretAccessKey,
      sessionToken: creds.sessionToken,
      region: region,
    },
    s3UploadOptions: {
      Bucket: bucket,
      // we can't call PutObjectACL with STS credentials, so we can't use public-read
      ACL: 'private',
    }
  }));
}

// TODO: use https://www.npmjs.com/package/d3-webpack-loader

module.exports = preset;
