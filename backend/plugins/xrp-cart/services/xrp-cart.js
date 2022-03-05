'use strict';

/**
 * xrp-cart.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */
const fs = require('fs');
const openpgp = require('openpgp');

async function  encryptMessage(message, decodeKey) {
  if (decodeKey == null)
    throw new Error('decodeKey should not be null');

  const encrypted = await openpgp.encrypt({
    message: await openpgp.createMessage({ text: message }),
    passwords: [decodeKey],
  });

  return encrypted;
}

async function decryptMessage(data, decodeKey) {
  const { data: decrypted } = await openpgp.decrypt({
    message: await openpgp.readMessage({ armoredMessage: data }),
    passwords: [decodeKey],
  });
  return decrypted;
}

module.exports = {
  saveXrpOwner: async (ctx) => {
    const body = JSON.stringify(ctx.request.body);  
    const emessage = await encryptMessage(body, strapi.config.uuid);
    const data = await new Promise((resolve, reject) => {
      fs.writeFile('.tmp/.xrpOwner', emessage, err => {
        err ? reject(err) : resolve();
      });
    });

    return emessage;
  },
  
  readXrpOwner: async () => {
    // Use fs.readFile() method to read the file
    const data = await new Promise((resolve, reject) => {
      fs.readFile('.tmp/.xrpOwner', 'utf8', (err, data) => {
        err ? reject(err) : resolve(data);
      });
    });

    const message = await decryptMessage(data, strapi.config.uuid);
    return JSON.parse(message);
  },
};
