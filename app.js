var vm = new Vue({
            el: '#vue-orgs',
            data:{
                search:'',
                survey:null,
              },
              watch: {
              // whenever search changes, this function will run
              search: function () {
                this.findText()
              }
            },
            created: function() {
                  console.log("created!");
                  this.getJson();
                },
            methods: {
                findText(){
                  console.log("find: "+this.search);
                  //TODO find in the json
                },
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
