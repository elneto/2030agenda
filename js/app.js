var vm = new Vue({
  el: '#vue-orgs',
  data: {
    search: '',
    survey: null,
    excerpt: null,
    questions: null,
  },
  computed: {
    orderedEntries: function() {
      return _.orderBy(this.excerpt, ['sorto', 'Short'], ['desc', 'asc']);
    }
  },
  watch: {
    // whenever search changes, this function will run
    search: function() {
      // this.findText()
      this.findOccurrences();

    }
  },
  created: function() {
    this.getJson();
    this.getQuestionsJson();
    this.getExcerptsJson();
  },
  methods: {
    toggleOrg(id) { //shows only the clicked button
      //this.findOccurrences();
      this.orderedEntries.forEach(function(entry) {
        if (entry.id == id) {
          if (entry.showO == 1)
            entry.showO = "";
          else
            entry.showO = 1;
        }
      });
    },
    clearSearch() {
      this.search = "";
    },
    writeModal(id, q) {
      //alert(id + q);
      entry = _.find(this.survey, {
        'id': id
      });
      $('#ModalAnswerTitle').text(entry.Organization);
      $('#modalBody').html("<h5>" + this.questionName(q) + "</h5><p>" + entry[q] + "</p>");
      $("#imageModal").attr("src", "https://sustainabledevelopment.un.org/content/images/flagbig6_" + entry.respondent_nr + ".jpg");
    },
    questionName(q) {
      return this.questions[q];
    },
    findOccurrences() {
      this.clearExcerpts();
      //todo trim this.search?
      if (this.search === '') {
        this.orderedEntries.forEach(function(entry) {
          entry.sorto = 0;
          entry.showO = 1;
        });
        $('#textTotal').text(0);
        return;
      }

      livesearch = this.search;
      var grandTotal = 0;
      for (var i = 0; i < this.survey.length; i++) { //for each entry
        var totalOrg = 0;
        this.excerpt[i].sorto = totalOrg;
        for (var key in this.survey[i]) {
          if (key.indexOf("q") != -1 || key.indexOf("docs") != -1) {

            let answer = this.survey[i][key];
            var arr = String(answer).match(new RegExp(livesearch, "gi"));
            if (arr) {

              var left_arr = String(answer).match(new RegExp("(\\S+\\s+){0,7}" + livesearch, "im"));
              var right_arr = String(answer).match(new RegExp(livesearch + "[^\.;]+", "i"));

              if (left_arr && right_arr) {
                var left = left_arr[0].substring(0, left_arr[0].length - livesearch.length);
                var right = right_arr[0].substring(livesearch.length);
                this.excerpt[i][key] = "..." + left + " <strong>" + livesearch + "</strong>" + right;
              }
              totalOrg += arr.length;
              this.excerpt[i].sorto = totalOrg;
            }
          }
        }
        grandTotal += totalOrg;

        $('#textTotal').text(grandTotal);
      } //end foreach
    },
    clearExcerpts() {
      this.orderedEntries.forEach(function(entry) {
        for (var k in entry) {
          if (entry.hasOwnProperty(k) && (k.indexOf("q") != -1 || k.indexOf("docs") != -1)) {
            entry[k] = "";
          }
        }
      });
    },
    showAll(val) {
      this.orderedEntries.forEach(function(entry) {
        entry.showO = val;
      });
    },
    getPar: function(q, s) {
      s = s ? s : window.location.search;
      var re = new RegExp('&' + q + '(?:=([^&]*))?(?=&|$)', 'i');
      return (s = s.replace(/^\?/, '&').match(re)) ? (typeof s[1] == 'undefined' ? '' : decodeURIComponent(s[1])) : undefined;
    },
    getOrg: function() {
      var org = this.getPar('org');

      if (typeof org !== 'undefined' && org !== null) {
        org = org.replace(/\+/g, " ");
        return org.toUpperCase();
      }
      return "";
    },
    getQ: function() {
      var org = this.getPar('q');

      if (typeof org !== 'undefined' && org !== null) {
        org = org.replace(/\+/g, " ");
        return org.toLowerCase();
      }
      return "";
    },
    getJson: function() {
      var _this = this;
      $.getJSON('surveyv.json', function(res) {
          _this.survey = res;
        }).done(function() {
          console.log("survey results loaded");
        })
        .fail(function(jqxhr, textStatus, error) {
          var err = textStatus + ", " + error;
          console.log("Request Failed: " + err);
        });
    },
    getQuestionsJson: function() {
      var _this = this;
      $.getJSON('questions.json', function(res) {
          _this.questions = res;
        }).done(function() {
          console.log("questions.json loaded");
        })
        .fail(function(jqxhr, textStatus, error) {
          var err = textStatus + ", " + error;
          console.log("Questions.json Request Failed: " + err);
        });
    },
    getExcerptsJson: function() {
      var _this = this;
      $.getJSON('excerpts.json', function(res) {
          _this.excerpt = res;
        }).done(function() {
          console.log("excerpts.json loaded");
        })
        .fail(function(jqxhr, textStatus, error) {
          var err = textStatus + ", " + error;
          console.log("excerpts.json Request Failed: " + err);
        });
    }
  }
});