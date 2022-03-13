# xrp-strapi-plugin

## Background

This project is intended to demonstrate Strapi plugin that run on XRP NFT feature by managing the shopping cart for your e-commerse that is build using Strapi.

In this project, we cloned the `ecommerce` [template](https://strapi.io/starters/strapi-starter-next-js-ecommerce) that is created by Strapi.
`yarn create strapi-starter my-project next-ecommerce`

The invoice or token of the transaction is issued as NFT based [XRP NFT Concept](https://xrpl.org/non-fungible-tokens.html) shared.
![NFT Lifecycle](https://xrpl.org/img/nft-lifecycle.png)

## Getting started
- Clone the project
- `yarn install` to install `node_modules` for frontend and backend.
- `yarn develop` to run development for frontend and strapi backend.
- `cd develop` -> `yarn develop --watch-admin` to develop strapi admin page.
- Setup the frontend to integrate with the cart [here](backend/plugins/xrp-cart/README.md).

## Endpoint definition
- `localhost:1337` - Strapi backend
- `localhost:8000` - Strapi backend (development for `--watch-admin`)
- `localhost:3000` - NextJS frontend ecommerce

## Demo
- [Video Demo](https://www.youtube.com/watch?v=2w09NoBm7Dc)
- [Frontend Application Demo](https://xrp-strapi-plugin-ieta56uox-blueorbitz.vercel.app/)
- [Backend Application Demo](https://strapi-xrp-demo.herokuapp.com/admin)

## Reference
- [XRP NFT Explorer](https://nft-devnet.xrpl.org)
- [XRP Module](https://js.xrpl.org/modules.html)
- [XRP NFT Ts Definition](https://github.com/XRPLF/xrpl.js/tree/1e30b4cb4349c084de20dc9ff2f3b6985b6d1498/packages/xrpl/src/models/transactions)
- [XRP NFT Tester](https://github.com/XRPLF/xrpl-dev-portal/blob/master/content/_code-samples/nftoken-tester/js/nftoken-tester.html)
- [Strapi v3 plugin tutorial](https://strapi.io/blog/how-to-create-an-import-content-plugin-part-1-4)
- [Strapi v3 docs](https://docs-v3.strapi.io/developer-docs/latest/development/local-plugins-customization.html)
- [BuffetJS used by Strapi](https://buffetjs.io/storybook/?path=/story/get-started--using-the-fonts)
- [BuffetJS Github Component](https://github.com/strapi/buffet/tree/master/packages/buffetjs-core/src/components)
- [Strapi package sample](https://beta.quod.ai/github/strapi/strapi/answers/details)
- [Strapi Admin: custom settings menu cause left menu section disappear](https://github.com/strapi/strapi/issues/10707)