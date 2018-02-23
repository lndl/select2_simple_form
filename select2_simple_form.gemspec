# -*- coding: UTF-8 -*-

$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "select2_simple_form/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "select2_simple_form"
  s.version     = Select2SimpleForm::VERSION
  s.authors     = ['Lautaro Nahuel De León', 'Nahuel Cuesta Luengo', 'Ivan Karl']
  s.email       = ['laudleon@gmail.com', 'nahuelcuestaluengo@gmail.com', 'ivan6258@gmail.com']
  s.homepage    = 'https://github.com/lndl/select2_simple_form'
  s.summary     = "Select2 inputs for SimpleForm"
  s.description = "Select2 inputs for SimpleForm"

  s.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["test/**/*"]

  s.add_dependency "rails", '> 4.0.0'
  s.add_dependency 'select2-rails', '~> 4.0.3'
end
