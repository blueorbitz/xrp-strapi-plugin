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
  Label,
  InputText,
  Button,
  Table,
} from "@buffetjs/core";
import Block from "../../components/Block";

const Row = styled.div`
  padding-top: 18px;
`;

const getUrl = to =>
  to ? `/plugins/${pluginId}/${to}` : `/plugins/${pluginId}`;

class HomePage extends React.Component {
  render() {
    const headers = [
      {
        name: 'TrxId',
        value: 'trxId',
      },
      {
        name: 'Date',
        value: 'date',
      },
      {
        name: 'Owner',
        value: 'owner',
      },
      {
        name: 'Content',
        value: 'content',
      },
    ];
    
    const rows = [
      {
        trxId: '000000000000',
        date: '2022.02.22 00:00:00',
        owner: 'Gagnaire',
        content: 'Ratatouille',
      },
      {
        trxId: '000000000000',
        date: '2022.02.22 00:00:00',
        owner: 'Veyrat',
        content: 'Lemon Chicken',
      },
      {
        trxId: '000000000000',
        date: '2022.02.22 00:00:00',
        owner: 'Blanc',
        content: 'Beef bourguignon',
      },
    ];

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
            title="Transactions"
            description="List of transactions made with NFT"
            style={{marginBottom: 12}}
          >
             <Table headers={headers} rows={rows} />
          </Block>
        </div>
      </div>
    );
  }
}

export default memo(HomePage);
