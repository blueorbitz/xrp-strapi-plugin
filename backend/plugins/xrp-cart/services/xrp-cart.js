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
    
    const xrpsetting = strapi.query("xrpsetting", "xrp-cart");
    let setting = await xrpsetting.findOne({ key: "xrp-cart-setting" });
    if (setting == null) 
      setting = await xrpsetting.create({
        key: "xrp-cart-setting",
        value: emessage,
      });
    else
    setting = await xrpsetting.update({ id: setting.id }, {
      value: emessage,
    });

    return emessage;
  },
  
  readXrpOwner: async () => {
    // Use fs.readFile() method to read the file
    const xrpsetting = strapi.query("xrpsetting", "xrp-cart");
    const setting = await xrpsetting.findOne({ key: "xrp-cart-setting" });
    if (setting == null)
      throw new Error("setting not saved!");

    const message = await decryptMessage(setting.value, strapi.config.uuid);
    return JSON.parse(message);
  },
};
