'use strict';

/**
 * xrp-cart.js controller
 *
 * @description: A set of functions called "actions" of the `xrp-cart` plugin.
 */

const send = require('koa-send');
const xrpl = require('xrpl');
const fs = require('fs');
const uuid = require('uuid');
const tempCart = {};
const rippleUrl = 'wss://xls20-sandbox.rippletest.net:51233';

module.exports = {

  index: async ctx => {
    // ctx.send({ message: 'ok' });
    console.log(ctx.params.id);
    await send(ctx, `.tmp/meta/${ctx.params.id}.json`);
  },

  paymentPage: async ctx => {
    await send(ctx, 'plugins/xrp-cart/public/pay.html');
  },

  myCart: async ctx => {
    const xrpId = ctx.request.query.id;
    ctx.send(tempCart[xrpId] || []);
  },

  addToCart: async ctx => {
    const data = JSON.parse(ctx.request.body);
    const { xrpId } = data;
    if (tempCart[xrpId] == null)
      tempCart[xrpId] = [];

    tempCart[xrpId].push(data);
    ctx.send(tempCart[xrpId]);
  },

  removeFromCart: async ctx => {
    const data = JSON.parse(ctx.request.body);
    const { xrpId, index } = data;
    if (tempCart[xrpId] == null)
      return;

    // const index = tempCart[xrpId].indexOf(itemId);
    tempCart[xrpId].splice(index, 1);
    ctx.send(tempCart[xrpId]);
  },

  postMinting: async ctx => {
    const data = JSON.parse(ctx.request.body);
    const { xrpId } = data;

    const uid = await storeMeta({ xrpId });
    const response = await mintToken({ uid });
    ctx.send(response);
  },

  postOffer: async ctx => {
    const data = JSON.parse(ctx.request.body);
    const { xrpId, payerAddress, TokenID } = data;

    const meta = tempCart[xrpId] || [];
    const amount = (meta.reduce((t, n) => t + n.itemPrice, 0.0) * 1000000).toString();

    const response = await createSellOffer({ TokenID, payerAddress, amount });
    delete tempCart[xrpId];

    ctx.send(response);
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

async function storeMeta({ xrpId }) {
  const uid = uuid.v4();
  const meta = tempCart[xrpId] || [];

  // store data file, assume IPFS storage here
  await fs.promises.mkdir('.tmp/meta', { recursive: true }).catch(console.error);
  await new Promise((resolve, reject) => {
    fs.writeFile(`.tmp/meta/${uid}.txt`, JSON.stringify(meta), err => {
      err ? reject(err) : resolve();
    });
  });

  return uid;
}

const ENUM_FLAG = {
  tfBurnable: 0x00000001,
  tfOnlyXRP: 0x00000002,
  tfTrustLine: 0x00000004,
  tfTransferable: 0x00000008,
};

async function mintToken({ uid }) {
  try {
    const services = strapi.plugins['xrp-cart'].services;
    const owner = await services["xrp-cart"].readXrpOwner();
    const wallet = xrpl.Wallet.fromSeed(owner.xrpAccountSecret);
    const client = new xrpl.Client(rippleUrl);
    await client.connect();
    console.log("Connected to Sandbox");

    // Note that you must convert the token URL to a hexadecimal
    // value for this transaction.
    // ----------------------------------------------------------
    const transactionBlob = {
      TransactionType: "NFTokenMint",
      Account: wallet.classicAddress,
      URI: xrpl.convertStringToHex(uid),
      Flags: parseInt(ENUM_FLAG.tfBurnable | ENUM_FLAG.tfOnlyXRP | ENUM_FLAG.tfTransferable),
      TokenTaxon: 0, //Required, but if you have no use for it, set to zero.
    };
    console.log(transactionBlob);

    // Submit signed blob --------------------------------------------------------
    const tx = await client.submitAndWait(transactionBlob, { wallet });
    console.log("Transaction result:", tx.result.meta.TransactionResult);

    // Check transaction results -------------------------------------------------
    const AffectedNodes = tx.result.meta.AffectedNodes[0];
    let accountNFTs;
    if (AffectedNodes.CreatedNode != null)
      accountNFTs = AffectedNodes.CreatedNode.NewFields.NonFungibleTokens;
    else
      accountNFTs = AffectedNodes.ModifiedNode.FinalFields.NonFungibleTokens;
    const TokenID = accountNFTs[accountNFTs.length - 1].NonFungibleToken.TokenID;
    const hash = tx.result.hash;
    client.disconnect();

    console.log("hash:", hash);
    console.log("TokenID:", TokenID);
    return { hash, TokenID };
  }
  catch (error) {
    console.log(error);
  }
}

async function createSellOffer({ TokenID, payerAddress, amount }) {
  try {
    const services = strapi.plugins['xrp-cart'].services;
    const owner = await services["xrp-cart"].readXrpOwner();
    const wallet = xrpl.Wallet.fromSeed(owner.xrpAccountSecret);
    const client = new xrpl.Client(rippleUrl);
    await client.connect();
    console.log("Connected to Sandbox");

    // Prepare transaction -------------------------------------------------------
    const transactionBlob = {
      "TransactionType": "NFTokenCreateOffer",
      "Account": wallet.classicAddress,
      "TokenID": TokenID,
      "Amount": amount,
      "Flags": parseInt(ENUM_FLAG.tfBurnable),
      "Destination": payerAddress,
    };
    console.log(transactionBlob);

    // Submit signed blob --------------------------------------------------------
    const tx = await client.submitAndWait(transactionBlob, { wallet }); //AndWait
    console.log("Transaction result:", JSON.stringify(tx.result.meta.TransactionResult, null, 2));
    const hash = tx.result.hash;
    console.log("hash:", hash);

    console.log("***Sell Offers***");
    let nftSellOffers;
    try {
      nftSellOffers = await client.request({
        method: "nft_sell_offers",
        tokenid: TokenID,
      });
    } catch (err) {
      console.log("No sell offers.");
    }
    console.log(nftSellOffers);
    const OfferID = nftSellOffers.result.offers[0].index;

    // Check transaction results -------------------------------------------------

    client.disconnect();

    console.log("OfferID:", OfferID);
    return { OfferID, hash };
  }
  catch (error) {
    console.log(error);
  }
}
