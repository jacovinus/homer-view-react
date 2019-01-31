/**
 *
 * MessagesTab
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import Table from 'components/Table/Loadable';
import LoadingIndicator from 'components/LoadingIndicator';
import _ from 'lodash';
import moment from 'moment';
import makeSelectMessagesTab from './selectors';
import reducer from './reducer';
import saga from './saga';
import * as actions from './actions';
/* eslint-disable react/prefer-stateless-function */
export class MessagesTab extends React.Component {
  state = {
    dataTable: {},
    dataHead: {},
  };

  componentDidMount() {
    if (!this.props.messagesTab.loaded) {
      // Put here parsed data
      this.props.getTransactionMessages();
    }
  }

  /* eslint-disable */
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.messagesTab.loaded &&
      !_.isEqual(this.props.messagesTab.data, nextProps.messagesTab.loaded)
    ) {
      const data = _.cloneDeep(nextProps.messagesTab.data.data.messages);

      const dataTable = _.map(data, (val, index) => [
        { key: 'id', label: val.id, id: val.id },
        { key: 'date', label: moment(val.create_date).format('DD-MM-YYYY') },
        { key: 'time', label: moment(val.create_date).format('HH:mm:ss.SSS') },
        {
          key: 'diff',
          label: data[index - 1]
            ? moment(val.create_date).diff(
              data[index - 1].create_date,
              'seconds',
              true,
            )
            : 0,
        },
        { key: 'event', ...this.eventSelectType(val) },
        { key: 'msgSize', label: val.raw.length },
        {
          key: 'srcIp',
          label: this.checkAlias(val, nextProps.messagesTab.data.data.alias)
            .srcAlias,
        },
        { key: 'srcPort', label: val.srcPort },
        {
          key: 'dstIp',
          label: this.checkAlias(val, nextProps.messagesTab.data.data.alias)
            .dstAlias,
        },
        { key: 'dstPort', label: val.dstPort },
        { key: 'proto', label: this.protoCheck(val.protocolFamily) },
        { key: 'type', ...this.transactionCheck(val.payloadType) },
      ]);

      const dataHead = [
        { key: 'id', label: 'Id' },
        { key: 'date', label: 'Date' },
        { key: 'time', label: 'Time' },
        { key: 'diff', label: 'Diff' },
        { key: 'event', label: 'Event' },
        { key: 'msgSize', label: 'Msg Size' },
        { key: 'srcIp', label: 'Src IP/Host' },
        { key: 'srcPort', label: 'Sport' },
        { key: 'dstIp', label: 'Dst IP/Host' },
        { key: 'dstPort', label: 'Dport' },
        { key: 'proto', label: 'Proto' },
        { key: 'type', label: 'Type' },
      ];
      this.setState({ dataTable, dataHead });
    }
  }

  eventSelectType(row) {
    if (row.event && (!row.method || !row.reply_reason)) {
      switch (row.event) {
        case 'CRITICAL':
          return { label: 'CRITICAL', styles: { color: 'red' } };
        case 'ERROR':
          return { label: 'ERROR', styles: { color: 'orange' } };
        case 'INVITE':
          return { label: 'ERROR', styles: { fontWeight: 'bolder' } };
        case parseInt(row.event, 10) >= 100 && row.event <= 189:
          return { label: row.event, styles: { fontWeight: 'grey' } };
        case parseInt(row.event, 10) >= 400:
          return { label: row.event, styles: { color: 'red' } };
        case parseInt(row.event, 10) === 200:
          return { label: row.event, styles: { color: 'green' } };
        default:
          return { label: '-', styles: { color: 'grey' } };
      }
    } else if (row.method || row.reply_reason) {
      switch (row.event) {
        case parseInt(row.reply_reason, 10) > 399:
          return { label: row.reply_reason, styles: { color: 'red' } };
        case parseInt(row.reply_reason, 10) > 100 && row.reply_reason < 299:
          return { label: row.reply_reason, styles: { color: 'green' } };
        case parseInt(row.reply_reason, 10) > 99 && row.reply_reason < 199:
          return { label: row.reply_reason, styles: { color: '#2077a0' } };
        default:
          return { label: row.method, styles: { color: 'grey' } };
      }
    } else {
      return this.transactionCheck(row.payloadType);
    }
  }

  transactionCheck(type) {
    if (parseInt(type, 10) === 86) return { label: 'XLOG' };
    if (parseInt(type, 10) === 87) return { label: 'MI' };
    if (parseInt(type, 10) === 1) return { label: 'SIP' };
    if (parseInt(type, 10) === 100) return { label: 'LOG' };
    if (parseInt(type, 10) === 88) return { label: 'REST' };
    if (parseInt(type, 10) === 89) return { label: 'NET' };
    if (parseInt(type, 10) === 4) return { label: 'WebRTC' };
    return { label: 'Unknown' };
  }

  checkAlias(address, aliasObj) {
    const aliasObject = _.cloneDeep(aliasObj);

    const srcAlias = _.find(
      aliasObject,
      (val, index) =>
        index === `${address.srcIp}:${address.srcPort}` ||
        index === address.srcIp,
    );
    const dstAlias = _.find(
      aliasObject,
      (val, index) =>
        index === `${address.dstIp}:${address.dstPort}` ||
        index === address.dstIp,
    );

    return {
      srcAlias: srcAlias || address.srcIp,
      dstAlias: dstAlias || address.dstIp,
    };
  }

  /* eslint-enable */
  protoCheck(type) {
    if (parseInt(type, 10) === 2) return 'UDP';
    if (parseInt(type, 10) === 1) return 'TCP';
    return 'UDP';
  }

  render() {
    const { dataTable, dataHead } = this.state;
    return (
      <div>
        {this.props.messagesTab.loaded ? (
          <Table tableBody={dataTable} tableHead={dataHead} />
        ) : (
          <LoadingIndicator />
        )}
      </div>
    );
  }
}

MessagesTab.propTypes = {
  messagesTab: PropTypes.object.isRequired,
  getTransactionMessages: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  messagesTab: makeSelectMessagesTab(),
});

function mapDispatchToProps(dispatch) {
  return {
    getTransactionMessages: searchParams =>
      dispatch(actions.getMessagesAction(searchParams)),
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'messagesTab', reducer });
const withSaga = injectSaga({ key: 'messagesTab', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(MessagesTab);
