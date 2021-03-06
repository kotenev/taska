import React from 'react';
import UserStore from '../stores/UserStore.jsx';
import {Login} from '../actions/api.jsx'
import UserActions from '../actions/UserActions.jsx';
import {getContentTableSizeWithTabs, getContentTableSize} from '../page_settings.jsx';

import StateActions from '../actions/StateActions.jsx';
import StateStore from '../stores/StateStore.jsx';

const Authentication = {
    statics: {
        willTransitionTo: function (transition, params, query, callback) {
            var nextPath = transition.path;
            // Must clear on all pages!
            if(StateStore.isUnsaved()){
                console.log('THERE ARE UNSAVED DATA');
                transition.abort();
                StateActions.alert(
                {
                    'title':'Unsaved Data',
                    'message': 'There is unsaved data. Are you sure you want to leave ? Unsaved data will be lost.',
                    onConfirm: (context)=>{
                        // User confirmed he wants to lose data
                        StateActions.save(false);
                        StateActions.dismissAlert(false);

                        // Hell, i can't seem to be able to do it with a transition here... have some kind of race condition
                        // so i use a hard redirect, better than nothing...
                        window.location.replace(nextPath);
                    }
                });
            }

            let promise = UserActions.loadDetailIfNecessary.triggerPromise('me').then(
                (user_data) => {
                    if(user_data.email === undefined)
                        transition.redirect('login',{}, {'nextPath' : nextPath });

                    callback();
                }
            ).catch(ex=>{
                console.log(ex.status);

                switch(ex.status){
                    case 0: StateActions.alert({
                        title: 'Connection Failed',
                        message: 'Connection Failed, please try again, if the problem persists contact the administrator.'
                    }); break;
                    case 404: transition.redirect('NotFound',{},{}); break;
                    default: transition.redirect('InternalError',{},{}); break;
                }
            });
        }
    }
};

const CheckLog = {
    statics: {
        willTransitionTo: function (transition, params, query, callback) {
            var nextPath = transition.path;
            UserActions.loadDetailIfNecessary.triggerPromise('me').then(
                (user_data) => {
                    if(user_data.email != undefined)
                        transition.redirect('app');

                    callback();
                }
            );
        }
    }
};


const TableComponentMixin = {
    componentDidMount: function() {
        this.setPage(0);
    },
    getState: function(){
      return {
            hash: this.props.hash || undefined,
            entries: this.tableStore.getList(),
            currentPage: this.tableStore.getPage(),
            maxPages: this.tableStore.getMaxPage(),
            externalResultsPerPage: this.tableStore.getPageSize(),
            externalSortColumn: this.tableStore.getSortColumn(),
            externalSortAscending: this.tableStore.getSortAscending()
      }
    },
    getInitialState: function() {
        return this.getState();
    },
    //what page is currently viewed
    setPage: function(index){
        //console.log($('div:last').height($(window).height() - $('div:last').offset().top - 30));

      console.log(`Set page ${index}`);
      this.tableAction($.extend(this.getState(), {currentPage: index}), this.state.hash);
    },
    //this will handle how the data is sorted
    sortData: function(sort, sortAscending, data){
        console.log(`sortData`);
        console.log(sort);
        console.log(sortAscending);
        console.log(data);
    },
    //this method handles the filtering of the data
    setFilter: function(filter){
        console.log('setFilter');
    },
    //this method handles determining the page size
    setPageSize: function(size){
        console.log('setPageSize');
    },
    //this method handles change sort field
    changeSort: function(sort){
        console.log(`Sort by ${sort} ${this.state.externalSortAscending}`);

        let order = this.state.externalSortAscending;
        order = (this.state.externalSortColumn === sort)? !order:true;

        this.tableAction(
            $.extend(this.getState(), {
                externalSortColumn: sort,
                externalSortAscending: order
            })
        );

    },
    contentTableSize(tabs){
        if(tabs)
            return getContentTableSizeWithTabs();
        else
            return getContentTableSize();
    },
    commonTableSettings: function(tabs){
        return {
            useExternal: true,
            externalSetPage: this.setPage,
            externalChangeSort: this.changeSort,
            externalSetFilter: this.setFilter,
            externalSetPageSize:this.setPageSize,
            externalMaxPage:this.state.maxPages,
            externalCurrentPage:this.state.currentPage,
            resultsPerPage:this.state.externalResultsPerPage,
            externalSortColumn:this.state.externalSortColumn,
            externalSortAscending:this.state.externalSortAscending,
            bodyHeight:this.contentTableSize(tabs),
            tableClassName: "table table-striped",
            results: this.state.entries,
            useGriddleStyles: false,
            nextClassName: "table-prev",
            previousClassName: "table-next",
            sortAscendingComponent: <i className="pull-right fa fa-sort-asc"></i>,
            sortDescendingComponent: <i className="pull-right fa fa-sort-desc"></i>
        }
    },
    commonTableStyle: function(){

    },
};

// From http://jsfiddle.net/LBAr8/

/* Create a new "layer" on the page, like a modal or overlay.
 *
 * var LayeredComponent = React.createClass({
 *     mixins: [LayeredComponentMixin],
 *     render: function() {
 *         // render like usual
 *     },
 *     renderLayer: function() {
 *         // render a separate layer (the modal or overlay)
 *     }
 * });
 */

const LayeredComponentMixin = {
    componentDidMount: function() {
        // Appending to the body is easier than managing the z-index of
        // everything on the page.  It's also better for accessibility and
        // makes stacking a snap (since components will stack in mount order).
        this._layer = document.createElement('div');
        document.body.appendChild(this._layer);
        this._renderLayer();
    },

    componentDidUpdate: function() {
        this._renderLayer();
    },

    componentWillUnmount: function() {
        this._unrenderLayer();
        document.body.removeChild(this._layer);
    },

    _renderLayer: function() {
        // By calling this method in componentDidMount() and
        // componentDidUpdate(), you're effectively creating a "wormhole" that
        // funnels React's hierarchical updates through to a DOM node on an
        // entirely different part of the page.

        var layerElement = this.renderLayer();
        // Renders can return null, but React.render() doesn't like being asked
        // to render null. If we get null back from renderLayer(), just render
        // a noscript element, like React does when an element's render returns
        // null.
        if (layerElement === null) {
            React.render(<noscript />, this._layer);
        } else {
            React.render(layerElement, this._layer);
        }

        if (this.layerDidMount) {
            this.layerDidMount(this._layer);
        }
    },

    _unrenderLayer: function() {
        if (this.layerWillUnmount) {
            this.layerWillUnmount(this._layer);
        }

        React.unmountComponentAtNode(this._layer);
    }
};

export default {Authentication, CheckLog, TableComponentMixin, LayeredComponentMixin}


