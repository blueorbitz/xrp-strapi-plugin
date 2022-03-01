import React from 'react';
import { CheckPagePermissions } from 'strapi-helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import App from './containers/App';
import Initializer from './containers/Initializer';
import lifecycles from './lifecycles';
import trads from './translations';
import SettingPage from './containers/SettingPage';

export default strapi => {
  const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;
  const icon = pluginPkg.strapi.icon;
  const name = pluginPkg.strapi.name;

  const plugin = {
    blockerComponent: null,
    blockerComponentProps: {},
    description: pluginDescription,
    icon,
    id: pluginId,
    initializer: Initializer,
    injectedComponents: [],
    isReady: false,
    isRequired: pluginPkg.strapi.required || false,
    layout: null,
    lifecycles,
    mainComponent: App,
    name,
    preventComponentRendering: false,
    trads,
    menu: {
      pluginsSectionLinks: [
        {
          destination: `/plugins/${pluginId}`,
          icon,
          label: {
            id: `${pluginId}.plugin.name`,
            defaultMessage: name,
          },
          name,
          permissions: [
            // Uncomment to set the permissions of the plugin here
            // {
            //   action: '', // the action name should be plugins::plugin-name.actionType
            //   subject: null,
            // },
          ],
        },
      ],
    },
    // settings: {
    //   menuSection: {
    //     id: pluginId,
    //     title: "Xrp Cart Plugin",
    //     links: [
    //       {
    //         title: {
    //           id: pluginId + '.setting',
    //           defaultMessage: 'XRP Cart Settings',
    //         },
    //         name: 'settings',
    //         to: `${strapi.settingsBaseURL}/${pluginId}`,
    //         Component: () => (
    //           <SettingPage />
    //         ),
    //         permissions: [],
    //       },
    //     ],
    //   },
    // },
  };

  return strapi.registerPlugin(plugin);
};
