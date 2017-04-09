# Select2SimpleForm

Select2SimpleForm is a custom input for SimpleForm which wraps and simplifies the Select2 functionality, without messing around with JS stuff.

## Installation

Assuming you are using SimpleForm and a working Select2 plugin (a fast way of doing so is installing and configuring a Rails Select2 plugin, like this [one](https://github.com/argerim/select2-rails)). After having done this, then:

Add this to your **Gemfile**:

```ruby
gem 'select2_simple_form', github: 'lndl/select2_simple_form', tag: '0.7.3'
```

And this into your **app/assets/javascripts/application.js**
(making sure that the following line have to be placed after Select2 JS):

```js
//= require select2_simple_form
```

And you're done my dear friend!

## Usage

All you're gonna do is to use SimpleForm inputs *as: :select2*.

#### with collections

Render a Select2 simple collection (selecting a single item):
```erb
<%= f.input :countries, as: :select2, collection: Country.all %>
```

Render a Select2 multiple collection (selecting several items):
```erb
<%= f.input :countries, as: :select2, collection: Country.all, multiple: true %>
```

#### with ajax

Render a Select2 performing an AJAX request that finds and shows the data (selecting a single item).
```erb
<%= f.input :countries, as: :select2, ajax: 'http://route/to/get/data/for/input' %>
```

Render a Select2 performing an AJAX request that finds and shows the data (selecting several items).
```erb
<%= f.input :countries, as: :select2, ajax: 'http://route/to/get/data/for/input', multiple: true %>
```

## i18n

Internationalization (i18n) can be achieved yielding a hash whose keys are equals to js format functions.
There are two ways:

### global way

Using a initializer:
```ruby
Select2SimpleForm.configure do |config|
  # Spanish messages
  config.i18n = {
    formatNoMatches:       "No se encontraron resultados",
    formatInputTooShort:   "Por favor ingrese :n: caracter/es",
    formatInputTooLong:    "Por favor elimine :n: caracter/es",
    formatSelectionTooBig: "Sólo puede seleccionar :limit: elemento/s",
    formatLoadMore:        "Cargando más resultados...",
    formatSearching:       "Buscando..."
  }
end
```

### in particular input

```erb
<%= f.input :persona_id, as: :select2, ajax: search_path, i18n: { formatNoMatches: 'No se ha encontrado a la persona buscada' } %>
```

i18n messages can have parameters (check out the 'global' example), like **:n:**, **:limit:**, in order to render the proper quantities in JS.
