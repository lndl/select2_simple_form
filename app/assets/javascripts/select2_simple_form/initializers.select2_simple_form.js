// Select2 for Simple Form initializer
var Select2SimpleForm = (function($) {
  'use strict';

  var prepareSelect2Options = function(options, $input) {
    var select2Options = {};

    var sanitizeInputValues = function(input) {
      return input.val().replace(/\[|\]|\"|\'/g, '');
    }

    select2Options.placeholder = options.placeholder

    // Check for multiple
    if (options.multiple) {
      select2Options.multiple = true;

      // When initialize the Select2 element, checks if it's multiple or not.
      // In the first case, it will use all the data retrieved. Otherwise,
      // will use the first item because it works in this way and assumes
      // the widget is in single mode.
      var $form = $input.closest('form');
      $form.on('submit', function() {
        if (!$input.val().match(/^\s*$/)) {
          var ids = $input.val().split(',');
          for (var i in ids)
            $form.append('<input type="hidden" name="' + $input.attr('name') + '[]" value="' + ids[i] + '">');
        } else {
          $form.append('<input type="hidden" name="' + $input.attr('name') + '[]" value="">');
        }
        $input.prop('disabled', true);
      });
    }

    // Check for creation box when there were no results
    if (options.can_create_on_empty_result) {
      select2Options.formatNoMatches = function(term) {
        return '<span style="cursor: pointer;" onclick="openTab(\'' + options.can_create_on_empty_result.url + '\')"> <span class="glyphicon glyphicon-plus" aria-hidden="true"></span> ' + options.can_create_on_empty_result.label + '</span>';
      }
    }

    // Allow for HTML markup to show properly in the resulting options
    if (options.allow_html) {
      var stripDiacritics = window.Select2.util.stripDiacritics;

      // We're going to use a slight variation of Select2 markMatch function
      // to avoid matches inside html tags:
      function markMatch(text, term, markup, escapeMarkup) {
        var searchRegex = stripDiacritics(term.toUpperCase()) + "(?![^<]*>)";
        var match = stripDiacritics(text.toUpperCase()).match(searchRegex),
            tl    = term.length;

        match = match ? match.index : -1;

        if (match < 0) {
            markup.push(escapeMarkup(text));
            return;
        }

        markup.push(escapeMarkup(text.substring(0, match)));
        markup.push("<span class='select2-match'>");
        markup.push(escapeMarkup(text.substring(match, match + tl)));
        markup.push("</span>");
        markup.push(escapeMarkup(text.substring(match + tl, text.length)));
      }

      function formatResult(result, container, query, escapeMarkup){
        var markup=[];
        markMatch(this.text(result), query.term, markup, escapeMarkup);
        return markup.join("");
      }

      select2Options.escapeMarkup = function(m) { return m; };
      select2Options.formatResult = formatResult;
    }

    // Check AJAX options
    if (options.ajax) {
      select2Options.ajax = {
        url: options.ajax,
        dataType: 'json',
        quietMillis: 250,
        data: function (term, page) {
          return {
            q: term, page: page
          };
        },
        results: function (data, page) {
          return { results: data };
        }
      };

      // By default, minimum input length will be 1
      select2Options.minimumInputLength = 1;

      // When initialize the Select2 element, checks if it's multiple or not.
      // In the first case, it will use all the data retrieved. Otherwise,
      // it will use the first item, because selects only one element.
      select2Options.initSelection = function(element, callback) {
        var ids = sanitizeInputValues(element);
        if (ids.length > 0) {
          $.get(options.ajax, { id: ids })
          .done(function(data) {
            if ( options.multiple ) {
              element.val('');
              callback(data);
            } else {
              callback(data[0]);
            }
          });
        }
      }
    }

    if (options.void_option) {
      $input.append($('<option value="">' + options.void_option + '</option>'));
    }

    if (options.i18n) {
      $.extend($.fn.select2.defaults, {
        formatNoMatches:       function () { return options.i18n.formatNoMatches },
        formatInputTooShort:   function (input, min) { var n = min - input.length; return options.i18n.formatInputTooShort.replace(':n:', n) },
        formatInputTooLong:    function (input, max) { var n = input.length - max; return options.i18n.formatInputTooLong.replace(':n:', n) },
        formatSelectionTooBig: function (limit) { return options.i18n.formatSelectionTooBig.replace(':limit:', limit) },
        formatLoadMore:        function (pageNumber) { return options.i18n.formatLoadMore.replace(':pageNumber:', pageNumber) },
        formatSearching:       function () { return options.i18n.formatSearching; },
      });
    }

    $.extend(select2Options, options.opts_for_select2 || {});

    return select2Options;
  };

  var initializeSelect2SimpleForm = function(options) {
    $(this).find('[data-ui="select2-simpleform"]').each(function() {
      var $this = $(this);
      var dataOptions = $this.data('options');
      var initializerOptions = prepareSelect2Options(dataOptions || options || {}, $this);
      $this.select2(initializerOptions);

      // Post plugins for Select2
      if (dataOptions.sortable) {
        $this.select2('container').find('ul.select2-choices').sortable({
          containment: 'parent',
          start: function() { $this.select2('onSortStart'); },
          update: function() { $this.select2('onSortEnd'); }
        });
      }
    });
  }

  // Load the plugin
  var eventToListen = (window.Turbolinks === undefined) ? 'ready' : 'page:change';
  $(document).on(eventToListen, initializeSelect2SimpleForm);

  return {
    init: function(options, selector) {
      var sel = selector || 'body';
      initializeSelect2SimpleForm.call($(sel), options);
    }
  }
}(jQuery));
