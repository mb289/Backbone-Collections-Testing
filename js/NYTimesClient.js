(function(window, undefined) {
    "use strict";

    var nytVenue = Backbone.Model.extend({
        defaults: function() {
            return{
                title:'',
                snippet: ''
            };
        }
    });
    var nytVenue = Backbone.Collection.extend({
        model: nytVenue
    });
    
    var nytVenueView = Backbone.View.extend({
            tagName: "div",
            className: "nytVenue",
            initialize: function(opts) {
                // 1. Sometimes it will be instantiated without options, so to guard against errors:
                this.options = _.extend({}, {
                        $container: $('body')
                    },
                    opts
                );

                // 2. Part of putting a view into its initial state is to put its element
                //    into the DOM. Its container should be configurable using an option
                //    so that a) it can be used anywhere in the app and b) it can be
                //    easily unit tested.
                this.options.$container.append(this.el);

                // 3. Render the content of the view
                this.render();
            },
            template: "<h4>{headline.main}</h4><hr><h6>{snippet}</h6>",
            render: function() {
                this.el.innerHTML = _.template(this.template, this.options);
            }
        })
        //http://api.nytimes.com/svc/search/v2/articlesearch.jsonp?q=new+york+times&page=2&sort=oldest&api-key=d7a58babbe65fed015dc5d38f0b7fda4:19:70145037&callback=svc_search_v2_articlesearch
    
    function NYTimesClient(options) {
        this.options = _.extend({}, options, {
            Api_key: "d7a58babbe65fed015dc5d38f0b7fda4:19:70145037"
        });

        this.init();
    }

    window.svc_search_v2_articlesearch = function(data){
       // debugger;
        console.log(data);
    }

    NYTimesClient.prototype.queryAPI = function(search) {
        var url = [
            "http://api.nytimes.com/svc/search/v2/articlesearch.jsonp"
        ];
        return $.ajax({
            url: url.join(''),
            dataType: "jsonp",
            data: {
                q: "new+york+times",
                page: "2",
                sort: "oldest",
                "api-key": this.options.Api_key
            },
            type: "GET",
            crossDomain: true,
            jsonp: "callback",
            jsonpCallback: "svc_search_v2_articlesearch"
        });
    };

    // NYTimesClient.prototype.getGeo = function() {
    //     var promise = $.Deferred();
    //     navigator.geolocation.getCurrentPosition(function(){
    //         promise.resolve(arguments[0]);
    //     });
    //     return promise;
    // };

    NYTimesClient.prototype.makeNYTRequest = function(search) {
        $.when(
            this.queryAPI()
        ).then(function() {
           // debugger;
            arguments[0].response.docs.forEach(function(data) {
                new nytVenueView(data);
            })

        }).fail(function(){
            arguments;
           // debugger;
        })
    };

    NYTimesClient.prototype.init = function() {
        var self = this;
        // this.getGeo().then(function(coordinates){

        self.makeNYTRequest();
        console.log("Hi");
        // })
    };

    window.NYTimesClient = NYTimesClient;
})(window, undefined);
