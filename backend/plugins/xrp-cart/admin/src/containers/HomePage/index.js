/*
 *
 * HomePage
 *
 */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import pluginId from '../../pluginId';
import {
  HeaderNav,
  LoadingIndicator,
  PluginHeader,
} from "strapi-helper-plugin";
import {
  Select,
  Label,
  InputText,
} from "@buffetjs/core";

const Row = styled.div`
  padding-top: 18px;
  padding-left: 18px;
  padding-right: 18px;
`;

class HomePage extends Component {
  render() {
    return (
      <div className={"container-fluid"} style={{padding: "18px 30px"}}>
        <PluginHeader
          title={"XRP Shopping Cart"}
          description={"Integrate e-commerce with XRP and get rewarded with NFT"}
        />
        <HeaderNav
          links={[
            {
              name: "Transactions",
              to: getUrl("")
            },
            {
              name: "Settings",
              to: getUrl("settings")
            }
          ]}
          style={{marginTop: "4.4rem"}}
        />
        <div className="row">
          <Block
            title="General"
            description="List of transactions made with NFT"
            style={{marginBottom: 12}}
          >
            <Row className={"row"}>
              <div className={"col-4"}>
                <Label htmlFor="wallet">Wallet Address</Label>
                <InputText
                  name="input"
                  onChange={({ target: { value } }) => {
                    // setWallet(value);
                  }}
                  type="text"
                  value={wallet}
                />
              </div>
              <div className={"col-4"}>
                <Label htmlFor="secret">Wallet Secret</Label>
                <InputText
                  name="input"
                  onChange={({ target: { value } }) => {
                    // setSecret(value);
                  }}
                  type="password"
                  value={secret}
                />
              </div>
            </Row>
          </Block>
        </div>
      </div>
    );
  }
}

export default memo(HomePage);
