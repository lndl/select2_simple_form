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
          $input.prop('disabled', true);
        }
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
      select2Options.escapeMarkup = function(m) { return m; };
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

    select2Options.formatSearching = 'Buscando...'

    if (options.void_option) {
      $input.append($('<option value="">' + options.void_option + '</option>'));
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
