var vm = new Vue({
            el: '#vue-orgs',
            data:{
                survey:null,
              },
            created: function() {
                  console.log("created!");
                  this.getJson();
                },
            methods: {
                getJson: function(){
                  console.log("in getJson!");
                  var _this = this;
                  $.getJSON('survey_results_min.json',function(res){
                    console.log("in getJson de jQuery!");
                    //console.log(res);
                    _this.survey = res;
                  }).done(function() {
                    console.log( "second success" );
                  })
                  .fail(function( jqxhr, textStatus, error ) {
                      var err = textStatus + ", " + error;
                      console.log( "Request Failed: " + err );
                  })
                  .always(function() {
                    console.log( "complete" );
                  });
              }
            }
        });
