require 'select2_simple_form/version'
require 'select2_simple_form/engine'

module Select2SimpleForm
  mattr_accessor :i18n

  def self.configure(&block)
    yield self
  end
end
