class ListLoader{
    constructor(options) {
        this.__loaded = {};
        this.model = options.model;
        this.dontrepeat = options.dontrepeat || false;

    }

    load(callback, state){
        if(!this.dontrepeat || this.__loaded[state.currentPage] === undefined){
                this.__loaded[state.currentPage] = true;

                let order = (state.externalSortAscending)? '':'-';
                $.ajax({
                  url: `api/${this.model}/?page=${state.currentPage+1}&ordering=${order}${state.externalSortColumn}`,
                  dataType: 'json',
                  success: function(data) {

                    callback(data, state);

                  }.bind(this),
                  error: function(xhr, status, err) {
                    console.error(status, err.toString());
                  }.bind(this)
                });
        }
    }
}

class DetailLoader{
    constructor(options) {
        this.model = options.model;
        this.hash = options.hash;
    }
    load(callback){
        console.log(`api/${this.model}/${this.hash}/`);
            $.ajax({
                  url: `api/${this.model}/${this.hash}/`,
                  dataType: 'json',
                  success: function(data) {
                    callback(data);
                  }.bind(this),
                  error: function(xhr, status, err) {
                    console.error(`Unable to load "api/${this.model}/${this.hash}/"`);
                  }.bind(this)
            });
    }
}

export default {ListLoader, DetailLoader}
