var vm = new Vue({
    el: '#vue-orgs',
    data:{
        search:'',
        survey:null,
        questions:null,
        surveyQJson:null,
      },
      watch: {
      // whenever search changes, this function will run
      search: function () {
        // this.findText()
        this.findOccurrences()
      }
    },
    created: function() {
          this.getJson();
          this.getQuestionsJson();
        },
    methods: {
        findOccurrences(){
          if (this.search===''){
            //todo change 8 to totalObjects in array
            for (var i=1; i<=8; i++){
                $('#badge'+i).text(0);
            }
            $('#textTotal').text(0);
              return;
          }

          livesearch = this.search;
          var grandTotal = 0;
          this.survey.forEach(function(entry){
            var totalOrg = 0;
            for(var answer in entry){
              //entry has the question or key and entry[answer] the actual answer
              var arr = String(entry[answer]).match(new RegExp(livesearch,"gi"));
              if (arr){
                //console.log(answer)
                //console.log(arr.length);
                totalOrg += arr.length;
              }
            }
            //console.log(entry.Short + " " + totalOrg);
            grandTotal += totalOrg;
            $('#badge'+entry.id).text(totalOrg);
            //console.log('total '+grandTotal)
            $('#textTotal').text(grandTotal);
          });
        },
        findText(){
          //console.log("find: "+this.search);
          this.showAll();
          this.unhighlightAll("q1");
          if (this.search==='') return;
          livesearch = this.search;

          //finds all answers that cointain that question
          answers = this.surveyQJson.find("q1",
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
              //console.log(value[Short]);
              _this.showId(value[Short]);
              _this.highlightId(value[Short],q1,livesearch);
          });
        },
        showId: function(id){
          _.each(this.survey, function(entry){
            if (id==entry[Short]){
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
            if (id==entry[Short]){
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
             return org.toUpperCase();
          }
          return "";
        },
        getQ: function(){
          var org = this.getPar('q');

          if (typeof org !== 'undefined' && org !== null) {
             org = org.replace(/\+/g, " ");
             return org.toLowerCase();
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
      },
        getQuestionsJson: function(){
          var _this = this;
          $.getJSON('questions.json',function(res){
            _this.questions = res;
          }).done(function() {
            console.log( "questions.json loaded" );
          })
          .fail(function( jqxhr, textStatus, error ) {
              var err = textStatus + ", " + error;
              console.log( "Questions.json Request Failed: " + err );
          });
      }
    }
});
