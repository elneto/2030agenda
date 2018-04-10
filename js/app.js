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
          //console.log("find: "+this.search);
          this.showAll();
          this.unhighlightAll("1. Since the adoption of the 2030 Agenda and the SDGs, has the governing body of your organization taken (or will it take) any decisions or new strategies to guide the implementation of the 2030 Agenda and the SDGs? If any, please provide a brief summary below, including the overarching vision of your organization.");
          if (this.search==='') return;
          livesearch = this.search;

          //finds all answers that cointain that question
          answers = this.surveyQJson.find("1. Since the adoption of the 2030 Agenda and the SDGs, has the governing body of your organization taken (or will it take) any decisions or new strategies to guide the implementation of the 2030 Agenda and the SDGs? If any, please provide a brief summary below, including the overarching vision of your organization.",
                    function(){
                      var re=new RegExp(livesearch,"gi");
                      //console.log(this.match(re));
                      return this.match(re);
                    }).parent();
          //console.log(answers);
          this.hideAll();
          //the code below shows the answers where the keyword is present
          _this = this;
          answers.each(function (index, path, value) {
              //console.log(value.Organization);
              //console.log(value["Respondent ID"]);
              _this.showId(value["Respondent ID"]);
              _this.highlightId(value["Respondent ID"],
                "1. Since the adoption of the 2030 Agenda and the SDGs, has the governing body of your organization taken (or will it take) any decisions or new strategies to guide the implementation of the 2030 Agenda and the SDGs? If any, please provide a brief summary below, including the overarching vision of your organization.",
                livesearch);
          });
        },
        showId: function(id){
          _.each(this.survey, function(entry){
            if (id==entry["Respondent ID"]){
              entry.show=1;
            }
          });
        },
        unhighlightAll: function(question){
          _.each(this.survey, function(entry){
            var re=new RegExp('\<span class\=\"highlight\"\>',"gi");
            entry[question] = entry[question].replace(re,'');
            var re2=new RegExp('\<\/span\>',"gi");
            entry[question] = entry[question].replace(re2,'');
          });
        },
        highlightId: function(id, question, word){
          _.each(this.survey, function(entry){
            if (id==entry["Respondent ID"]){
              //todo: somehow reuse the regexp
              var re=new RegExp("("+word+")","gi");
              //todo: replace with match so the case is not low
              entry[question] = entry[question].replace(re,'<span class="highlight">$1</span>');
            }
          });
        },
        hideAll: function(){
          _.each(this.survey, function(entry){
              entry.show=0;
          });
        },
        showAll: function(){
          _.each(this.survey, function(entry){
              entry.show=1;
          });
        },
        getPar: function(q,s){
          s = s ? s : window.location.search;
          var re = new RegExp('&' + q + '(?:=([^&]*))?(?=&|$)', 'i');
          return (s = s.replace(/^\?/, '&').match(re)) ? (typeof s[1] == 'undefined' ? '' : decodeURIComponent(s[1])) : undefined;
        },
        getOrg: function(){
          var org = this.getPar('org');

          if (typeof org !== 'undefined' && org !== null) {
             org = org.replace(/\+/g, " ");
             console.log("org is " + org);
             return org.toUpperCase();
          }
          return "";
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
