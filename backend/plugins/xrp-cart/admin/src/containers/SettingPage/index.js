/*
 *
 * SettingPage
 *
 */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import {
  request,
  FormBloc,
  SizedInput,
  BaselineAlignment,
  CheckPagePermissions,
} from "strapi-helper-plugin";
import {
  Text,
  Button,
} from "@buffetjs/core";
import PluginWrapper from '../../components/PluginWrapper';

class SettingPage extends React.Component {
  state = {
    isLoading: false,
    isEditing: true,
    xrpAccountId: "",
    xrpAccountSecret: "",
  };

  componentDidMount = async () => {
    const data = await request("/xrp-cart/xrp-owner", {
      method: "GET",
    });
    data.xrpAccountSecret = "*****************************";
    this.setState(data);
  }

  toggleEditAccount = async () => {
    this.setState({ isEditing: !this.state.isEditing });
  };

  handleChange = (e) => {
    console.log({[e.target.name]: e.target.value});
    this.setState({[e.target.name]: e.target.value});
  };

  saveAccount = async () => {
    const { xrpAccountId, xrpAccountSecret } = this.state;
    await request("/xrp-cart/xrp-owner", {
      method: "POST",
      body: { xrpAccountId, xrpAccountSecret }
    });

    this.setState({ isEditing: false });
  }

  render() {
    const { isLoading, isEditing } = this.state;
    const { xrpAccountId, xrpAccountSecret } = this.state;

    return (
      <PluginWrapper
        title={"XRP Cart"}
        description={"Integrate e-commerce with XRP and get rewarded with NFT"}
      >
        <CheckPagePermissions permissions={[]}>
          <div>
            <BaselineAlignment top size="3px" />
            <FormBloc
              title={"Setup XRP Account"}
              subtitle={<>The plugin is configured through the <code>./config/plugins.js</code> file.</>}
              isLoading={isLoading}
              actions={isEditing 
                ? <>
                    <Button color="cancel" onClick={this.toggleEditAccount}>Cancel</Button>
                    <Button color="primary" onClick={this.saveAccount}>Save</Button>
                  </>
                : <Button color="secondary" onClick={this.toggleEditAccount}>Update</Button>
              }
            >
              <br />
              <SizedInput
                disabled={!isEditing} 
                label={"Account"}
                name="xrpAccountId"
                placeholder={"insert xrp account id"}
                onChange={this.handleChange}
                size={{ xs: 6 }}
                type="text"
                value={xrpAccountId}
              />
              <SizedInput
                disabled={!isEditing}
                label={"Secret"}
                name="xrpAccountSecret"
                placeholder={"insert xrp secret"}
                onChange={this.handleChange}
                size={{ xs: 6 }}
                type="password"
                value={xrpAccountSecret}
              />
            </FormBloc>
            <BaselineAlignment top size="32px" />
            <FormBloc
              title={"Setup Minting Rule"}
              subtitle={<>The plugin is configured through the <code>./config/plugins.js</code> file.</>}
              isLoading={isLoading}
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
