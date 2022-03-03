/*
 *
 * HomePage
 *
 */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  Button,
} from '@buffetjs/core';
import {
  BaselineAlignment,
} from "strapi-helper-plugin";
import PluginWrapper from '../../components/PluginWrapper';

class HomePage extends React.Component {
  test() {
    console.log('writing file');
  }

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
      <PluginWrapper
        title={"Transactions"}
        description={"List of transactions made with NFT"}
      >
        <Table headers={headers} rows={rows} />
        <BaselineAlignment top size="15px" />
        <Button color={"primary"} label={"test"} onClick={this.test}/>
      </PluginWrapper>
    );
  }
}

export default memo(HomePage);
