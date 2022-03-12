/*
 *
 * HomePage
 *
 */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  Text,
} from '@buffetjs/core';
import {
  request,
  BaselineAlignment,
  SizedInput,
} from "strapi-helper-plugin";
import PluginWrapper from '../../components/PluginWrapper';

class HomePage extends React.Component {
  state = {
    nfts: [],
    inputDestination: "",
    destinationError: "",
  };

  componentDidMount = async () => {
    try {
      const owner = await request("/xrp-cart/xrp-owner");
      const nfts = await request("/xrp-cart/get-xrp-token?account=" + owner.xrpAccountId);
      console.log(nfts);
      this.setState({ nfts });
    } catch (error) {
      strapi.notification.error(error.message);
      this.setState({ destinationError: "xrp account not found" });
    }
  }

  convertHexToString = str1 => {
    const hex = str1.toString();
    let str = '';
    for (let n = 0; n < hex.length; n += 2) {
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
  }

  handleChange = async e => {
    console.log({ [e.target.name]: e.target.value });
    this.setState({ inputDestination: e.target.value });

    try {
      const nfts = await request("/xrp-cart/get-xrp-token?account=" + e.target.value);
      this.setState({ nfts, destinationError: "" });
    } catch (error) {
      this.setState({ destinationError: "xrp account not found" });
    }
  }

  render() {
    const { nfts, inputDestination, destinationError } = this.state;

    const headers = [
      {
        name: 'TokenID',
        value: 'TokenID',
      },
      {
        name: 'URI',
        value: 'URI',
      },
      {
        name: 'Issuer',
        value: 'Issuer',
      },
      {
        name: 'Burnable',
        value: 'Burnable',
      },
      {
        name: 'TrustLine',
        value: 'TrustLine',
      },
      {
        name: 'Transferable',
        value: 'Transferable',
      },
    ];

    const rows = nfts.map(o => ({
      TokenID: o.TokenID,
      URI: this.convertHexToString(o.URI),
      Issuer: o.Issuer,
      Flags: o.Flags,
      Burnable: !!(o.Flags & 0x00000001) ? "✔" : "❌",
      TrustLine: !!(o.Flags & 0x00000004) ? "✔" : "❌",
      Transferable: !!(o.Flags & 0x00000008) ? "✔" : "❌",
    }));

    const CustomRow = ({ row }) => {
      const { TokenID, URI, Issuer, Burnable, TrustLine, Transferable } = row;

      const copiedToClipboard = (text) => {
        strapi.notification.info("Cell value is copied to clipboard.");
        navigator.clipboard.writeText(text);
      }

      return (
        <tr>
          <td onClick={() => copiedToClipboard(TokenID)}>
            <div style={{width:"150px"}}>
              <Text fontSize="sm" ellipsis>{TokenID}</Text>
            </div>
          </td>
          <td>
            <div style={{width:"80px"}}>
              <Text fontSize="sm" ellipsis>
                <a href={`${strapi.backendURL}/xrp-cart/ipfs/${URI}`} target="_blank">{URI}</a>
              </Text>
            </div>
          </td>
          <td onClick={() => copiedToClipboard(Issuer)}>
            <div style={{width:"120px"}}>
              <Text fontSize="sm" ellipsis>{Issuer}</Text>
            </div>
          </td>
          <td>
            <Text fontSize="sm">{Burnable}</Text>
          </td>
          <td>
            <Text fontSize="sm">{TrustLine}</Text>
          </td>
          <td>
            <Text fontSize="sm">{Transferable}</Text>
          </td>
        </tr>
      );
    };

    return (
      <PluginWrapper
        title={"Transactions by Destination"}
        description={"List of transactions made with NFT"}
      >
        <SizedInput
          label={"Search by destination"}
          name="destination"
          placeholder={"destination of the xrp address"}
          onChange={this.handleChange}
          size={{ xs: 10 }}
          type="text"
          value={inputDestination}
          description={destinationError}
        />
        <Table headers={headers} rows={rows} customRow={CustomRow} />
        <BaselineAlignment top size="15px" />
      </PluginWrapper>
    );
  }
}

export default memo(HomePage);
