'use strict';

import React from 'react/addons';
import Reflux from 'reflux';

import {HistoryTable} from './reusable/history.jsx';
import {WorkflowTable} from './reusable/workflow.jsx';
import {ProcessTable} from './reusable/process.jsx';
import {RequestTable} from './reusable/request.jsx';

import {Authentication} from '../mixins/component.jsx';

export default React.createClass({
  displayName: "",
  mixins: [Authentication],

  render: function () {
    return <LoggedInHome />;
  }
});

const LoggedInHome = React.createClass({
  render: function(){
    return (
          <div className="row">
              <div className="col-md-6">
                <WorkflowTable />
              </div>
              <div className="col-md-6">
                <ProcessTable />
              </div>
              <div className="col-md-6">
                <RequestTable />
              </div>
              <div className="col-md-6">
                <HistoryTable />
              </div>
          </div>
      );
  }
})