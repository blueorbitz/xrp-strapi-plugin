'use strict';

/**
 * xrp-cart.js controller
 *
 * @description: A set of functions called "actions" of the `xrp-cart` plugin.
 */

const send = require('koa-send');

module.exports = {

  index: async (ctx) => {
    ctx.send({ message: 'ok' });
  },

  paymentPage: async (ctx) => {
    await send(ctx, 'plugins/xrp-cart/public/pay.html');
  },

  postPayment: async (ctx) => {
    ctx.send({ message: 'ok' });
  },
  
  saveXrpOwner: async ctx => {
    const services = strapi.plugins['xrp-cart'].services;
    try {
      const data = await services["xrp-cart"].saveXrpOwner(ctx);
      ctx.send(data);
    } catch (error) {
      console.log(error);
      ctx.response.status = 406;
      ctx.response.message = "could not parse: " + error;
    }
  },
  
  readXrpOwner: async ctx => {
    const services = strapi.plugins['xrp-cart'].services;
    try {
      const data = await services["xrp-cart"].readXrpOwner(ctx);
      ctx.send(data);
    } catch (error) {
      console.log(error);
      ctx.response.status = 406;
      ctx.response.message = "could not parse: " + error;
    }
  },
};
