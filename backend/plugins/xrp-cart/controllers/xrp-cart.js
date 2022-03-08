'use strict';

/**
 * xrp-cart.js controller
 *
 * @description: A set of functions called "actions" of the `xrp-cart` plugin.
 */

const send = require('koa-send');
const path = require('path');
const xrpl = require('xrpl');
const fs = require('fs');
const uuid = require('uuid');
const rippleUrl = 'wss://xls20-sandbox.rippletest.net:51233';

module.exports = {

  index: async ctx => {
    let regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    const uuid = ctx.params.id;
    if (!regexExp.test(uuid)) {
      ctx.response.status = 400;
      ctx.response.message = "Bad request";
      return;
    }

    try {
      console.log('index', uuid, path.resolve('.tmp/meta'));
      await send(ctx, `${uuid}.json`, { root: path.resolve('.tmp/meta') });
    } catch {
      ctx.response.status = 404;
      ctx.response.message = "Not found";
    }
  },

  getToken: async ctx => {
    try {
      const client = new xrpl.Client(rippleUrl);
      await client.connect();

      const nfts = await client.request({
        method: "account_nfts",
        account: ctx.request.query.account,
      })
      client.disconnect();
      ctx.send(nfts.result.account_nfts);
    } catch (error) {
      ctx.response.status = 404;
      ctx.response.message = [];
    }
  },

  getPublicFile: async ctx => {
    const file = ctx.params.file;
    await send(ctx, `plugins/xrp-cart/public/${file}`);
  },

  myCart: async ctx => {
    const xrpId = ctx.request.query.id;

    const xrpcart = strapi.query("xrpcart", "xrp-cart");
    const cart = await xrpcart.findOne({ uid: xrpId });
    if (cart == null)
      ctx.send([]);
    else
      ctx.send(cart.content || []);
  },

  addToCart: async ctx => {
    const data = JSON.parse(ctx.request.body);
    const { xrpId } = data;

    const xrpcart = strapi.query("xrpcart", "xrp-cart");
    let cart = await xrpcart.findOne({ uid: xrpId });
    if (cart != null) {
      cart.content.push(data);
      cart = await xrpcart.update({ id: cart.id }, { content: cart.content });
    }
    else
      cart = await xrpcart.create({ uid: xrpId, content: [data] });
    ctx.send(cart.content || []);
  },

  removeFromCart: async ctx => {
    const data = JSON.parse(ctx.request.body);
    const { xrpId, index } = data;

    const xrpcart = strapi.query("xrpcart", "xrp-cart");
    let cart = await xrpcart.findOne({ uid: xrpId });
    if (cart == null)
      return;

    cart.content.splice(index, 1);
    cart = await xrpcart.update({ id: cart.id }, { content: cart.content });
    ctx.send(cart.content);
  },

  postMinting: async ctx => {
    const data = JSON.parse(ctx.request.body);
    const { xrpId } = data;

    const xrpcart = strapi.query("xrpcart", "xrp-cart");
    const cart = await xrpcart.findOne({ uid: xrpId });
    const content = cart != null ? cart.content : [];

    const uid = await storeMeta({ xrpId, content });
    const response = await mintToken({ uid });

    const xrptransaction = strapi.query("xrptransaction", "xrp-cart");
    const transaction = await xrptransaction.create({
      date: new Date(),
      tokenId: response.TokenID,
      url: uid,
      mintHashId: response.hash,
      content: content,
    });

    console.log("Mint success", transaction);
    ctx.send(response);
  },

  postOffer: async ctx => {
    const data = JSON.parse(ctx.request.body);
    const { xrpId, payerAddress, TokenID } = data;

    const xrpcart = strapi.query("xrpcart", "xrp-cart");
    const cart = await xrpcart.findOne({ uid: xrpId });
    const content = cart != null ? cart.content : [];

    const amount = parseInt(content.reduce((t, n) => t + n.itemPrice, 0.0) * 1000000).toString();

    const response = await createSellOffer({ TokenID, payerAddress, amount });

    let transaction;
    const xrptransaction = strapi.query("xrptransaction", "xrp-cart");
    transaction = await xrptransaction.findOne({ tokenId: TokenID });
    transaction = await xrptransaction.update({ id: transaction.id }, {
      destination: payerAddress,
      amount: amount,
      offerId: response.OfferID,
      offerHashId: response.hash,
    });

    await xrpcart.delete({ id: cart.id });

    console.log("Offer success", transaction);
    ctx.send(response);
  },

  saveXrpOwner: async ctx => {
    const services = strapi.plugins['xrp-cart'].services;
    try {
      const data = await services["xrp-cart"].saveXrpOwner(ctx);
      ctx.send({ message: 'ok' });
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

async function storeMeta({ xrpId, content }) {
  const uid = uuid.v4();
  const meta = content;

  // store data file, assume IPFS storage here
  await fs.promises.mkdir('.tmp/meta', { recursive: true }).catch(console.error);
  await new Promise((resolve, reject) => {
    fs.writeFile(`.tmp/meta/${uid}.json`, JSON.stringify(meta), err => {
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
    let Flags = ENUM_FLAG.tfOnlyXRP;
    if (owner.checkboxBurnable)
      Flags |= ENUM_FLAG.tfBurnable;
    if (owner.checkboxTrustLine)
      Flags |= ENUM_FLAG.tfTrustLine;
    if (owner.checkboxTransferable)
      Flags |= ENUM_FLAG.tfTransferable;

    const transactionBlob = {
      TransactionType: "NFTokenMint",
      Account: wallet.classicAddress,
      URI: xrpl.convertStringToHex(uid),
      Flags: parseInt(Flags),
      TokenTaxon: 0, //Required, but if you have no use for it, set to zero.
    };
    console.log(transactionBlob);

    // Submit signed blob --------------------------------------------------------
    const tx = await client.submitAndWait(transactionBlob, { wallet });
    console.log("Transaction result:", tx.result.meta.TransactionResult);

    // Check transaction results -------------------------------------------------
    const hash = tx.result.hash;
    
    const nfts = await client.request({
      method: "account_nfts",
      account: wallet.classicAddress,
    });

    let accountNFTs, TokenID;
    accountNFTs = nfts.result.account_nfts;
    TokenID = accountNFTs[accountNFTs.length - 1].TokenID;

    // const AffectedNodes = tx.result.meta.AffectedNodes[0];
    // console.log(AffectedNodes);
    // if (AffectedNodes.CreatedNode != null) {
    //   accountNFTs = AffectedNodes.CreatedNode.NewFields.NonFungibleTokens;
    //   TokenID = accountNFTs[accountNFTs.length - 1].NonFungibleToken.TokenID;
    // }
    // else {
    //   accountNFTs = AffectedNodes.ModifiedNode.FinalFields.NonFungibleTokens;
    //   TokenID = accountNFTs[accountNFTs.length - 1].NonFungibleToken.TokenID;
    // }

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
