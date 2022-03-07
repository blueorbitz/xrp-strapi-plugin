/*
 *
 * HomePage
 *
 */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import {
  HeaderNav,
  PluginHeader,
} from "strapi-helper-plugin";
import Block from "../../components/Block";

const getUrl = to =>
  to ? `/plugins/${pluginId}/${to}` : `/plugins/${pluginId}`;

class PluginWrapper extends React.Component {
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
              name: "Search Destination",
              to: getUrl("")
            },
          ]}
          style={{marginTop: "4.4rem"}}
        />        
        <div className="row">
          <Block
            title={this.props.title}
            description={this.props.description}
            style={{marginBottom: 12}}
          >
            {this.props.children}
          </Block>
        </div>
      </div>
    );
  }
}

export default memo(PluginWrapper);
