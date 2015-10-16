# Select2SimpleForm

Select2SimpleForm is a custom input for SimpleForm which wraps and simplifies the Select2 functionality, without messing around with JS stuff.

## Installation

Assuming you are using SimpleForm and a working Select2 plugin (a fast way of doing so is installing and configuring a Rails Select2 plugin, like this [one](https://github.com/argerim/select2-rails)). After having done this, then:

Add this to your **Gemfile**:

```ruby
gem 'select2_simple_form'
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
