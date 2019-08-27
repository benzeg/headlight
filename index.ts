import { Historian } from './src/Historian';

const historian = new Historian({ filename: 'test.json' });

historian.addToQueue({ url: 'https://benzeg.github.io'});