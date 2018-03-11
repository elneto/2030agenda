var vm = new Vue({
            el: '#vue-orgs',
            data:{
                search:'',
                survey:null,
                surveyQJson:null,
              },
              watch: {
              // whenever search changes, this function will run
              search: function () {
                this.findText()
              }
            },
            created: function() {
                  this.getJson();
                },
            methods: {
                findText(){
                  console.log("find: "+this.search);
                  livesearch = this.search;
                  answers = this.surveyQJson.find("1. Since the adoption of the 2030 Agenda and the SDGs, has the governing body of your organization taken (or will it take) any decisions or new strategies to guide the implementation of the 2030 Agenda and the SDGs? If any, please provide a brief summary below, including the overarching vision of your organization.",
                            function(){
                              var re=new RegExp(livesearch,"gi");
                              //console.log(this.match(re));
                              return this.match(re);
                            }).parent();
                  //console.log(answers);
                  answers.each(function (index, path, value) {
                      console.log(value.Organization);
                      console.log(value["Respondent ID"]);
                  });
                  //return this.sibling('Organization')

                },
                getJson: function(){
                  var _this = this;
                  $.getJSON('survey_results_min.json',function(res){
                    _this.survey = res;
                  }).done(function() {
                    console.log( "survey results loaded" );
                    _this.surveyQJson = jsonQ(_this.survey);
                  })
                  .fail(function( jqxhr, textStatus, error ) {
                      var err = textStatus + ", " + error;
                      console.log( "Request Failed: " + err );
                  });
              }
            }
        });
