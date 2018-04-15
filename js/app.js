var vm = new Vue({
    el: '#vue-orgs',
    data:{
        search:'',
        survey:null,
        questions:null,
      },
    computed: {
      orderedEntries: function () {
        return _.orderBy(this.survey, ['sorto','Short'], ['desc','asc']);
      }
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
      questionName(q){
        return this.questions[q];
      },
      findOccurrences(){
        this.hideQuestions();
        if (this.search===''){
          //todo change 8 to totalObjects in array
          this.survey.forEach(function(entry){
              entry.sorto=0;
              //$('#btn'+entry.id).removeClass('btn-success').addClass('btn-secondary');
          });
          $('#textTotal').text(0);
            return;
        }

        livesearch = this.search;
        var grandTotal = 0;
        this.survey.forEach(function(entry){ //for each entry
          var totalOrg = 0;
          entry.sorto = totalOrg;
          for(var answer in entry){
            //entry has the question or key and entry[answer] the actual answer
            var arr = String(entry[answer]).match(new RegExp(livesearch,"gi"));
            if (arr){
              //arr.length has the number of occurrences of the term searched in this answer
              $('#answer'+entry.id+answer).show();
              var left_arr = String(entry[answer]).match(new RegExp("(\\S+\\s+){0,7}"+livesearch,"im"));
              var right_arr = String(entry[answer]).match(new RegExp(livesearch+"[^\.;]+","i"));
              //entry[answer] = "";
              if (left_arr && right_arr){
                var left = left_arr[0].substring(0,left_arr[0].length-livesearch.length);
                var right = right_arr[0].substring(livesearch.length);
                $('#answertext'+entry.id+answer).html( "..."+left +" <strong>"+livesearch+ "</strong>" +right);
              }
              totalOrg += arr.length;
              entry.sorto = totalOrg;
              //console.log(entry.Short+" sorto = "+entry.sorto);
            }
          }
          //console.log(entry.Short + " " + totalOrg);
          grandTotal += totalOrg;
          //$('#badge'+entry.id).text(totalOrg);
          // if (entry.sorto>0){
          //   $('#btn'+entry.id).removeClass('btn-secondary').addClass('btn-success');
          // }
          // else{
          //   $('#btn'+entry.id).removeClass('btn-success').addClass('btn-secondary');
          // }
          //console.log('total '+grandTotal)
          $('#textTotal').text(grandTotal);
        });
      },
      hideQuestions(){
            this.survey.forEach(function(entry){ //for each entry
              for(var answer in entry){
                $('#answer'+entry.id+answer).hide();
              }
            });
        },
      // highlightId: function(id, question, word){
      //     _.each(this.survey, function(entry){
      //       if (id==entry[Short]){
      //         //todo: somehow reuse the regexp
      //         var re=new RegExp("("+word+")","gi");
      //         //todo: replace with match so the case is not low
      //         entry[question] = entry[question].replace(re,'<span class="highlight">$1</span>');
      //       }
      //     });
      //   },
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
