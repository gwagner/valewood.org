import fs from 'fs';
import AmpOptimizer from '@ampproject/toolbox-optimizer';
//const AmpOptimizer = require('@ampproject/toolbox-optimizer');

// create the AMP Optimizer instance
const ampOptimizer = AmpOptimizer.create();

var html = fs.readFileSync("index.html").toString();

const optimizedHtml = await ampOptimizer.transformHtml(html);

console.log(optimizedHtml)