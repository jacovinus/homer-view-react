import React, { PureComponent } from "react";
import AppBar from "@material-ui/core/AppBar";
import MaterialTabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Messages from "../../containers/Messages";
import QOS from "../../containers/QoS";
import Logs from "../../containers/Logs";
import Export from "../../containers/Export";
import "./styles.scss";
import Flow from "../../containers/Flow";

import getAllUrlParams from "../../utils/urlParams";
import config from "../../config";

class Tabs extends PureComponent {
  state = {
    value: "messages",
    availableTabs: config['UI'].availableTabs
  };

  componentDidMount(): void {
    this.detectTabs();
  }

  detectTabs() {
    let tabs = getAllUrlParams()["tabs"];

    if (tabs) {
      tabs = tabs
        .split(',')
        .map((tabName) => {
          return tabName.trim().toLowerCase();
        })
        .filter((tabName) => {
          return tabName.length
        });

      this.setState({
        availableTabs: tabs
      });
    }
  }

  isShowTab(tabName) {
    return this.state.availableTabs.indexOf(tabName) !== -1;
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  renderAvailableTabs() {
    const tabs = this.state.availableTabs.map((tabName) => {
      if (this.isShowTab(tabName)) {
        return (<Tab value={tabName} label={tabName}/>)
      }

      return null
    });

    return tabs;
  }

  render() {
    const { value } = this.state;

    return (
      <div>
        <AppBar position="static" color="default">
          <MaterialTabs
            value={value}
            onChange={this.handleChange}
            variant="fullWidth"
            scrollButtons="auto"
            indicatorColor="primary"
            textColor="primary"
          >
            {this.renderAvailableTabs()}
          </MaterialTabs>
        </AppBar>
        {value === "messages" ? <Messages /> : null}
        {value === "flow" ? <Flow /> : null}
        {value === "qos" ? <QOS /> : null}
        {value === "logs" ? <Logs /> : null}
        {value === "export" ? <Export /> : null}
      </div>
    );
  }
}

export default Tabs;
