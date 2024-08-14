import * as handlebars from 'handlebars';
import * as path from 'path';
import * as fs from 'fs';
import { ObjectLiteral } from '../types';

export function renderHtml(data: ObjectLiteral, template: string) {
  return new Promise((resolve, reject) => {
    console.log(`direname: `, __dirname);
    
    const pathName = path.resolve(__dirname, '..', '..', `templates/emails/${template}`);
    console.log(`direname: `, pathName);
    handleReadFile(pathName, function (err: unknown, html: string) {
      if (err) {
        reject(err);
      }

      const template = handlebars.compile(html);
      const htmlToSend = template(data);

      if (!htmlToSend) {
        reject('Unable to renderData to template');
      }

      resolve(htmlToSend);
    });
  });
}

function handleReadFile(path: string, callback: (...args) => void) {
  fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
    if (err) {
      throw err;
    } else {
      callback(null, html);
    }
  });
}
