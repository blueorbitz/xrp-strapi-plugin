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
  }
};
