/*
 *
 * SettingPage
 *
 */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import {
  FormBloc,
  SizedInput,
  BaselineAlignment,
  CheckPagePermissions,
} from "strapi-helper-plugin";
import {
  Text,
} from "@buffetjs/core";
import PluginWrapper from '../../components/PluginWrapper';

class SettingPage extends React.Component {
  render() {
    const title = "XRP Cart";
    const showLoader = false;

    return (
      <PluginWrapper
        title={title}
        description={"Integrate e-commerce with XRP and get rewarded with NFT"}
      >
        <CheckPagePermissions permissions={[]}>
          <div>
            <BaselineAlignment top size="3px" />
            <Text fontSize="md">
              The plugin is configured through the <code>./config/plugins.js</code> file.
            </Text>
            <FormBloc
              title={"Setup XRP Account"}
              isLoading={showLoader}
            >
              <br />
              <SizedInput
                disabled
                label={"Account"}
                name="xrp-account"
                placeholder={"insert xrp account id"}
                size={{ xs: 12 }}
                type="text"
                value={""}
              />
              <SizedInput
                label={"Secret"}
                name="xrp-secret"
                placeholder={"insert xrp secret"}
                size={{ xs: 6 }}
                type="password"
                value={""}
              />
              <SizedInput
                disabled
                label={"Encrypted Secret"}
                name="xrp-encoded-secret"
                placeholder={"encoded xrp secret"}
                size={{ xs: 6 }}
                type="password"
                value={"sada"}
              />
            </FormBloc>
            <BaselineAlignment top size="32px" />
            <Text fontSize="md">
              The plugin is configured through the <code>./config/plugins.js</code> file.
            </Text>
            <FormBloc
              title={"Setup Minting Rule"}
              isLoading={showLoader}
            >
              <SizedInput
                disabled
                label={"Minimum spend for NFT"}
                name="min-spend"
                size={{ xs: 6 }}
                type="checkbox"
                value={true}
              />
              <SizedInput
                disabled
                label={"Discount for NFT holder"}
                name="nft-discount"
                size={{ xs: 6 }}
                type="checkbox"
                value={true}
              />
            </FormBloc>
          </div>
        </CheckPagePermissions>
      </PluginWrapper>
    )
  }
}

export default memo(SettingPage);
