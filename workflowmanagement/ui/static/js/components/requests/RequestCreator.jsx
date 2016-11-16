'use strict';
import React from 'react';
import Router from 'react-router';
import Reflux from 'reflux';

import {Authentication} from '../../mixins/component.jsx';

import MessageActions from '../../actions/MessageActions.jsx';
import MessageStore from '../../stores/MessageStore.jsx';

export default React.createClass({
    mixins: [   Router.Navigation,
                Authentication,
                Reflux.listenTo(MessageStore, 'update')],
    __getState(){
        return {
            message: MessageStore.getDetail(),
            sended: MessageStore.getRequestAddFinished(),
            recipient: "All users (CHANGE THIS)"
        };
    },
    getInitialState(){
        return this.__getState();
    },
    componentWillMount(){
        //MessageActions.calibrate();
    },
    componentDidUpdate(){
        if(this.state.sended){
            this.goBack();
        }
    },
    update(status){
        this.setState(this.__getState());
    },
    setReqMessage(e){
        MessageActions.setMessage(e.target.value);
    },
    setReqTitle(e){
        MessageActions.setTitle(e.target.value);
    },
    goBackAndClean(){
        this.goBack();
    },
    setRequest(){
        MessageActions.send();
    },
    render(){
        return (
            <div className="request-detail row">
                <div className="col-md-12">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <center>
                                <i className="fa fa-life-ring pull-left"></i>
                                <h3 className="panel-title">Send message</h3>
                            </center>
                        </div>
                        <div className="panel-body">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-addon"><strong>Recipient</strong></span>
                                            <input disabled={true} className="form-control"
                                                   value={this.state.recipient}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-addon"><strong>Title</strong></span>
                                            <input onChange={this.setReqTitle} className="form-control"
                                                   value={this.state.message.title}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-addon"><strong>Message</strong></span>
                                                <textarea onChange={this.setReqMessage} rows="7"
                                                          className="form-control" value={this.state.message.message}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-9">

                                </div>
                                <div className="col-md-3">
                                    <div className="btn-group" role="group">
                                        <button type="button" onClick={this.goBackAndClean}
                                                className="btn btn-danger btn-default">
                                            <i style={{marginTop: '3px'}} className="pull-left fa fa-ban"></i> Cancel
                                        </button>
                                        <button type="button" onClick={this.setRequest}
                                                className="btn btn-primary btn-default">
                                            <i style={{marginTop: '3px'}} className="pull-left fa fa-envelope"></i> Send
                                            message
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <br />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});