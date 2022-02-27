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
  Flex,
  Label,
  InputText,
  Button,
  Checkbox,
} from "@buffetjs/core";
import Block from "../../components/Block";

const Row = styled.div`
  padding-top: 18px;
`;

const getUrl = to =>
  to ? `/plugins/${pluginId}/${to}` : `/plugins/${pluginId}`;

class HomePage extends React.Component {
  render() {    
    return (
      <div className={"container-fluid"} style={{padding: "18px 30px"}}>
        <PluginHeader
          title={"XRP Cart"}
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
            description="Setup xrp account for transactions"
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
                  value={""}
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
                  value={""}
                />
              </div>
            </Row>
            <Flex justifyContent='flex-end' alignItems="center">
              <Button color="primary">Save</Button>
            </Flex>
          </Block>
          
          <Block
            title="NFT Setting"
            description="Setup the condition to give NFT"
            style={{marginBottom: 12}}
          >
            <Row className={"row"}>
              <Checkbox
                message="Minimum spend for NFT"
                name="checkbox"
                onChange={({ target }) => setValue(target.value)}
                value={false}
              />
              {/* <InputText
                name="input"
                onChange={({ target: { value } }) => {
                  // setWallet(value);
                }}
                type="text"
                value={""}
              /> */}
            </Row>
            <Row className={"row"}>
              <Checkbox
                message="Discount for NFT holder"
                name="checkbox"
                onChange={({ target }) => setValue(target.value)}
                value={false}
              />
              {/* <InputText
                name="input"
                onChange={({ target: { value } }) => {
                  // setWallet(value);
                }}
                type="text"
                value={""}
              /> */}
            </Row>
            <Flex justifyContent='flex-end' alignItems="center">
              <Button color="primary">Save</Button>
            </Flex>
          </Block>
        </div>
      </div>
    );
  }
}

export default memo(HomePage);
