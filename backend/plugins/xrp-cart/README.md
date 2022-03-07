# Strapi plugin xrp-cart

A quick description of xrp-cart.

## Get started
- Once you have install the plugin. Enable all the permission to public.
- `Settings` -> `User Permissions` -> `Role` -> `Public` -> `XRP Cart` -> Select All
- Go to the XRP Setting to set the Issuer XRP account
- `Settings` -> `XRP Cart Setting` -> `Setup XRP Account` -> Save
- You can change the Minting rule too.

## How to use the plugin
Assuming you're using NextJS based on this example.

Include Jquery into the `_app.js`
```
<script
  src="https://code.jquery.com/jquery-3.6.0.slim.min.js"
  integrity="sha256-u7e5khyithlIdTpu22PHhENmPcRdFiHRjhAuHcs05RI="
  crossorigin="anonymous"
/>
```

Also include the logic of `xrp-cart` at the end of the script
```
<script src="http://localhost:1337/xrp-cart/public/xrp-cart-init.js" />
```

To add item to cart. Simply add the className with `.xrpcart-add-item` and provide the detail via `data-*` attribute.
```html
<button
  className="xrpcart-add-item rounded shadow"
  data-item-id={product.id}
  data-item-price={product.price}
  data-item-url={router.asPath}
  data-item-description={product.description}
  data-item-image={getStrapiMedia(
    product.image.formats.thumbnail.url
  )}
  data-item-name={product.title}
  v-bind="customFields"
>
  Add to cart
</button>
```

The checkout button can be added with `.xrpcart-checkout` and the total cart price can be added with `.xrpcart-total-price`.
```html
<button className="xrpcart-checkout">
  <NextImage height="150" width="150" src="/cart.svg" alt="Cart" />
  <span className="xrpcart-total-price ml-3 font-semibold text-sm text-indigo-500"></span>
</button>
```

To test the accepted offer, you can use this tool.
- [XRP NFT Tester](https://github.com/XRPLF/xrpl-dev-portal/blob/master/content/_code-samples/nftoken-tester/js/nftoken-tester.html)