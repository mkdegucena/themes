// Custom delimiter for Vue templates
Vue.options.delimiters = ['{[{', '}]}'];


var sidebar = new Vue({
  data: {
    isArticle: false,
    categories: [],
    sections: [],
    articles: [],
    currentArticle: null,
    activeSection: null,
    nav: {
      prev: null,
      next: null,
    }
  },

  created: function() {
    $("main").addClass("main-sidebar");
    this.isArticle = window.location.pathname.indexOf("/articles/") > -1;
    this.fetchData();
  },

  methods: {

    isOpen: function(id) {
      return id == this.activeSection ? 'open' : '';
    },

    isCurrent: function(id) {
      var currentId = this._getPageId(window.location.href);
      return id == currentId ? 'current' : '';
    },

    fetchData: function(url) {
      var url = url || "/api/v2/help_center/" + this._getLocale() + "/articles.json?per_page=100&include=sections,categories";

      $.get(url, function(data){
        if (data.count) {
          this.categories = _.sortBy(_.uniq(this.categories.concat(data.categories), "id"), "position");
          this.sections = _.sortBy(_.uniq(this.sections.concat(data.sections), "id"), "position");
          this.articles = _.sortBy(_.uniq(this.articles.concat(data.articles), "id"), "position");

          this.mapArticlesToSections(this.articles, this.sections);
          this.mapSectionsToCategories(this.sections, this.categories);

          // Set current article and nav links if on article page
          if (this.isArticle) {
            this.currentArticle = this.getCurrentArticle(this.articles);
            if (this.currentArticle) {
              this.activeSection = this.currentArticle.section_id;
              this.setNavLinks(this.sections, this.currentArticle);
            }
          }

          if (data.next_page) {
            this.fetchData(data.next_page + "&per_page=100");
          }
        }
      }.bind(this));
    },

    mapArticlesToSections: function(articles, sections) {
      var articleGroups = _.groupBy(articles, "section_id");

      _.each(sections, function(section){
        section.articles = articleGroups[section.id];
      }, this);
    },

    mapSectionsToCategories: function(sections, categories) {
      var sectionGroups = _.groupBy(sections, "category_id");

      _.each(categories, function(category){
        category.sections = sectionGroups[category.id];
      }, this);
    },

    setActiveSection: function(sectionId) {
      if (sectionId === this.activeSection) {
        this.activeSection = null;
      } else {
        this.activeSection = sectionId;
      }
    },

    getCurrentArticle: function(articles) {
      var currArticleId = this._getPageId(window.location.href),
          currArticle = _.find(articles, {id: currArticleId});

      return currArticle;
    },

    setNavLinks: function(sections, currArticle) {
      let currSection = _.find(sections, {id: currArticle.section_id}),
          currArticleIndex = _.findIndex(currSection.articles, {id: currArticle.id}),
          prevArticle,
          nextArticle;

      if (currArticleIndex !== 'undefined') {
        this.nav.prev = currArticleIndex > 0 ? currSection.articles[currArticleIndex - 1] : null;
        this.nav.next = currArticleIndex < currSection.articles.length ? currSection.articles[currArticleIndex + 1] : null;
      }

    },

    _getLocale: function() {
      var links = window.location.href.split("/"),
          hcIndex = links.indexOf("hc"),
          links2 = links[hcIndex + 1].split("?"),
          locale = links2[0];

      return locale;
    },

    _getPageId: function(url) {
      var links = url.split("/"),
          page = links[links.length - 1],
          result = page.split("-")[0];

      return parseInt(result,10) || null;
    },
  }
});





$(document).ready(function() {

  // social share popups
  $(".share a").click(function(e) {
    e.preventDefault();
    window.open(this.href, "", "height = 500, width = 500");
  });

  // show form controls when the textarea receives focus or backbutton is used and value exists
  var $commentContainerTextarea = $(".comment-container textarea"),
  $commentContainerFormControls = $(".comment-form-controls, .comment-ccs");

  $commentContainerTextarea.one("focus", function() {
    $commentContainerFormControls.show();
  });

  if ($commentContainerTextarea.val() !== "") {
    $commentContainerFormControls.show();
  }

  // Expand Request comment form when Add to conversation is clicked
  var $showRequestCommentContainerTrigger = $(".request-container .comment-container .comment-show-container"),
    $requestCommentFields = $(".request-container .comment-container .comment-fields"),
    $requestCommentSubmit = $(".request-container .comment-container .request-submit-comment");

  $showRequestCommentContainerTrigger.on("click", function() {
    $showRequestCommentContainerTrigger.hide();
    $requestCommentFields.show();
    $requestCommentSubmit.show();
    $commentContainerTextarea.focus();
  });

  // Mark as solved button
  var $requestMarkAsSolvedButton = $(".request-container .mark-as-solved:not([data-disabled])"),
    $requestMarkAsSolvedCheckbox = $(".request-container .comment-container input[type=checkbox]"),
    $requestCommentSubmitButton = $(".request-container .comment-container input[type=submit]");

  $requestMarkAsSolvedButton.on("click", function () {
    $requestMarkAsSolvedCheckbox.attr("checked", true);
    $requestCommentSubmitButton.prop("disabled", true);
    $(this).attr("data-disabled", true).closest("form").submit();
  });

  // Change Mark as solved text according to whether comment is filled
  var $requestCommentTextarea = $(".request-container .comment-container textarea");

  $requestCommentTextarea.on("keyup", function() {
    if ($requestCommentTextarea.val() !== "") {
      $requestMarkAsSolvedButton.text($requestMarkAsSolvedButton.data("solve-and-submit-translation"));
      $requestCommentSubmitButton.prop("disabled", false);
    } else {
      $requestMarkAsSolvedButton.text($requestMarkAsSolvedButton.data("solve-translation"));
      $requestCommentSubmitButton.prop("disabled", true);
    }
  });

  // Disable submit button if textarea is empty
  if ($requestCommentTextarea.val() === "") {
    $requestCommentSubmitButton.prop("disabled", true);
  }

  // Submit requests filter form in the request list page
  $("#request-status-select, #request-organization-select")
    .on("change", function() {
      search();
    });

  // Submit requests filter form in the request list page
  $("#quick-search").on("keypress", function(e) {
    if (e.which === 13) {
      search();
    }
  });

  function search() {
    window.location.search = $.param({
      query: $("#quick-search").val(),
      status: $("#request-status-select").val(),
      organization_id: $("#request-organization-select").val()
    });
  }

  $(".header .icon-menu").on("click", function(e) {
    e.stopPropagation();
    var menu = document.getElementById("user-nav");
    var isExpanded = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", !isExpanded);
  });

  if ($("#user-nav").children().length === 0) {
    $(".header .icon-menu").hide();
  }

  // Submit organization form in the request page
  $("#request-organization select").on("change", function() {
    this.form.submit();
  });

  // Toggles expanded aria to collapsible elements
  $(".collapsible-nav, .collapsible-sidebar").on("click", function(e) {
    e.stopPropagation();
    var isExpanded = this.getAttribute("aria-expanded") === "true";
    this.setAttribute("aria-expanded", !isExpanded);
  });
});
