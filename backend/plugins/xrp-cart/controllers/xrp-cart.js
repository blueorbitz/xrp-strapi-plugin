'use strict';

/**
 * xrp-cart.js controller
 *
 * @description: A set of functions called "actions" of the `xrp-cart` plugin.
 */

const send = require('koa-send');
const tempCart = {};

module.exports = {

  index: async (ctx) => {
    ctx.send({ message: 'ok' });
  },

  paymentPage: async (ctx) => {
    await send(ctx, 'plugins/xrp-cart/public/pay.html');
  },

  myCart: async (ctx) => {
    const xrpId = ctx.request.query.id;
    ctx.send(tempCart[xrpId] || []);
  },

  addToCart: async (ctx) => {
    const data = JSON.parse(ctx.request.body);
    const { xrpId } = data; 
    if (tempCart[xrpId] == null)
      tempCart[xrpId] = [];

    tempCart[xrpId].push(data);
    ctx.send(tempCart[xrpId]);
  },

  removeFromCart: async (ctx) => {
    const data = JSON.parse(ctx.request.body);
    const { xrpId, index } = data; 
    if (tempCart[xrpId] == null)
      return;

    // const index = tempCart[xrpId].indexOf(itemId);
    tempCart[xrpId].splice(index, 1);
    ctx.send(tempCart[xrpId]);
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
