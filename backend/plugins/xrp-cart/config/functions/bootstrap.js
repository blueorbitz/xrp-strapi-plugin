'use strict';

module.exports = async () => {
  // Add permissions
  const actions = [
    {
      section: 'settings',
      category: 'xrp-cart',
      displayName: 'Access the XRP Cart Settings page',
      uid: 'settings.read',
      pluginName: 'xrp-cart',
    },
  ];

  await strapi.admin.services.permission.actionProvider.registerMany(actions);
};