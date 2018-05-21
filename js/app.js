var vm = new Vue({
  el: '#vue-orgs',
  data: {
    search: '',
    survey: null,
    surveyhtml: null,
    excerpt: null,
    questions: null,
    loading: 0
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
    this.getHTMLJson();
    this.getQuestionsJson();
    this.getExcerptsJson();
  },
  methods: {
    removeUnderscore(str) {
      return str.replace("_", " ");
    },
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
    toggleQuestionOrg(id) { //shows only the clicked button
      this.surveyhtml.forEach(function(entry) {
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
      var entry = _.find(this.surveyhtml, {
        'id': String(id)
      });
      $('#ModalAnswerTitle').text(entry.Organization);
      $('#modalBody').html("<h5>" + this.questionName(q) + "</h5><p>" + entry[q] + "</p>");
      $("#imageModal").attr("src", "https://sustainabledevelopment.un.org/content/images/flagbig6_" + entry.respondent_nr + ".jpg");
    },
    questionName(q) {
      if (this.questions)
        return this.questions[q];
    },
    findOccurrences() {
      this.clearExcerpts();

      let s = this.getParameter('s');
      if (s) {
        this.search = s;
        window.history.replaceState({}, document.title, "/" + "search.html");
      }
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
                this.excerpt[i][key] = "..." + left + " <strong>" + arr[0] + "</strong>" + right;
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
    showAllQuestion(val) {
      this.surveyhtml.forEach(function(entry) {
        entry.showO = val;
      });
    },
    getPar: function(q, s) {
      s = s ? s : window.location.search;
      var re = new RegExp('&' + q + '(?:=([^&]*))?(?=&|$)', 'i');
      return (s = s.replace(/^\?/, '&').match(re)) ? (typeof s[1] == 'undefined' ? '' : decodeURIComponent(s[1])) : undefined;
    },
    getParameter: function(name) {
      let p = this.getPar(name);

      if (typeof p !== 'undefined' && p !== null) {
        p = p.replace(/\+/g, " ");
        return name === 'q' ? p.toLowerCase() : p;
      }
      return "";
    },
    getJson: function() {
      this.loading += 1;
      var _this = this;
      //$.getJSON('/api1/unsurveyjson.php', function(res) {
      $.getJSON('surveyv.json', function(res) {
          _this.survey = res;
        }).done(function() {
          _this.loading -= 1;
          console.log("survey results loaded");
        })
        .fail(function(jqxhr, textStatus, error) {
          var err = textStatus + ", " + error;
          console.log("Request Failed: " + err);
        });
    },
    getHTMLJson: function() {
      this.loading += 1;
      var _this = this;
      //$.getJSON('/api1/unsurveyjson.php?html=1', function(res) {
      $.getJSON('surveyhtml.json', function(res) {
          _this.surveyhtml = res;
        }).done(function() {
          _this.loading -= 1;
          console.log("surveyhtml.json loaded");
        })
        .fail(function(jqxhr, textStatus, error) {
          var err = textStatus + ", " + error;
          console.log("Request Failed: " + err);
        });
    },
    getQuestionsJson: function() {
      this.loading += 1;
      var _this = this;
      $.getJSON('questions.json', function(res) {
          _this.questions = res;
        }).done(function() {
          _this.loading -= 1;
          console.log("questions.json loaded");
        })
        .fail(function(jqxhr, textStatus, error) {
          var err = textStatus + ", " + error;
          console.log("Questions.json Request Failed: " + err);
        });
    },
    getExcerptsJson: function() {
      this.loading += 1;
      var _this = this;
      //$.getJSON('/api1/unsurveyblank.php', function(res) {
      $.getJSON('excerpts.json', function(res) {
          _this.excerpt = res;
        }).done(function() {
          _this.loading -= 1;
          console.log("excerpts.json loaded");
        })
        .fail(function(jqxhr, textStatus, error) {
          var err = textStatus + ", " + error;
          console.log("excerpts.json Request Failed: " + err);
        });
    }
  }
});