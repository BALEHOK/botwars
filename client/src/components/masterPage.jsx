import React from 'react';
import { Link } from 'react-router';
import DocumentTitle from 'react-document-title';

import Header from './header';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <DocumentTitle title='Bot Wars'>
        <div>
          <Header />
          {this.props.children}
        </div>
      </DocumentTitle>
    );
  }
}
