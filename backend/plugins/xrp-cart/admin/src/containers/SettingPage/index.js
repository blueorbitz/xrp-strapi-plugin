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
  SettingsPageTitle,
} from "strapi-helper-plugin";
import {
  Button,
  Checkbox,
  InputNumber,
} from "@buffetjs/core";
import { Header } from '@buffetjs/custom';

class SettingPage extends React.Component {
  state = {
    isLoading: false,
    isEditing: false,
    xrpAccountId: "",
    xrpAccountSecret: "",
    checkboxBurnable: false,
    checkboxTrustLine: false,
    checkboxTransferable: false,
    checkboxDiscount: false,
    inputDiscount: "",
  };

  componentDidMount = async () => {
    const data = await request("/xrp-cart/xrp-owner", {
      method: "GET",
    });
    this.setState(data);
  }

  toggleEditAccount = async () => {
    this.setState({ isEditing: !this.state.isEditing });
  };

  handleChange = (e) => {
    console.log({ [e.target.name]: e.target.value });
    this.setState({ [e.target.name]: e.target.value });
  };

  saveSetting = async () => {
    const { xrpAccountId, xrpAccountSecret } = this.state;
    const { checkboxBurnable, checkboxTrustLine, checkboxTransferable } = this.state;
    const { checkboxDiscount, inputDiscount } = this.state;

    console.log({
      xrpAccountId, xrpAccountSecret,
      checkboxBurnable, checkboxTrustLine, checkboxTransferable,
      checkboxDiscount, inputDiscount,
    });

    await request("/xrp-cart/xrp-owner", {
      method: "POST",
      // body: { xrpAccountId, xrpAccountSecret }
      body: {
        xrpAccountId, xrpAccountSecret,
        checkboxBurnable, checkboxTrustLine, checkboxTransferable,
        checkboxDiscount, inputDiscount,
      },
    });

    this.setState({ isEditing: false });
  }

  render() {
    const { isLoading, isEditing } = this.state;
    const { xrpAccountId, xrpAccountSecret } = this.state;
    const { checkboxBurnable, checkboxTrustLine, checkboxTransferable } = this.state;
    const { checkboxDiscount, inputDiscount } = this.state;

    return (
      <>
        <CheckPagePermissions permissions={[{ action: 'plugins::xrp-cart.settings.read', subject: null }]}>
          <SettingsPageTitle name={"XRP Cart Setting"} />
          <div>
            <Header
              title={{ label: "XRP Cart" }}
              content={"Integrate e-commerce with XRP and get rewarded with NFT"}
            />
            <BaselineAlignment top size="3px" />
            <FormBloc
              title={"Setup XRP Account"}
              subtitle={<>The plugin is configured through the <code>./config/plugins.js</code> file.</>}
              isLoading={isLoading}
              actions={isEditing
                ? <>
                  <Button color="cancel" onClick={this.toggleEditAccount}>Cancel</Button>
                  <Button color="primary" onClick={this.saveSetting}>Save</Button>
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
              actions={<Button color="primary" onClick={this.saveSetting}>Save</Button>}
            >
              <div>
                <ul>
                  <li key={"Burnable"}>
                    <Checkbox
                      message="Burnable: indicates that the minted token may be burned by the issuer."
                      name="checkboxBurnable"
                      onChange={this.handleChange}
                      value={checkboxBurnable}
                    />
                  </li>
                  <li key={"TrustLine"}>
                    <Checkbox
                      message="TrustLine: indicates that the issuer wants a trustline to be automatically created."
                      name="checkboxTrustLine"
                      onChange={this.handleChange}
                      value={checkboxTrustLine}
                    />
                  </li>
                  <li key={"Transferable"}>
                    <Checkbox
                      message="Transferable: indicates that this NFT can be transferred."
                      name="checkboxTransferable"
                      onChange={this.handleChange}
                      value={checkboxTransferable}
                    />
                  </li>
                  <li key={"Discount"}>
                    <Checkbox
                      message="Discount: discount will be given to NFT holder of this issuer."
                      name="checkboxDiscount"
                      onChange={this.handleChange}
                      value={checkboxDiscount}
                    />
                    <InputNumber
                      name="input-Discount"
                      placeholder="In percentage. Eg. 10 for (10%)"
                      onChange={this.handleChange}
                      value={inputDiscount}
                    />
                  </li>
                </ul>
              </div>
            </FormBloc>
          </div>
        </CheckPagePermissions>
      </>
    )
  }
}

export default memo(SettingPage);
