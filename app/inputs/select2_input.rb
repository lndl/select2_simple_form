class Select2Input < SimpleForm::Inputs::Base
  def input(wrapper_options)
    klass = if options.has_key? :ajax
      generate_input_from SimpleForm::Inputs::StringInput
            else
      generate_input_from SimpleForm::Inputs::CollectionSelectInput
            end

    klass.new(@builder, @attribute_name, @column, @input_type, options).input wrapper_options
  end

  private

  def generate_input_from(input_class)
    Class.new(input_class) do
      def input_html_options
        sup = super

        settings = Hash.new.tap do |s|
          s[:ajax]        = options.delete(:ajax)        if options[:ajax]
          s[:sortable]    = options.delete(:sortable)    if options[:sortable]
          s[:placeholder] = options.delete(:placeholder) if options[:placeholder]
          s[:void_option] = options.delete(:void_option) if options[:void_option]
          s[:opts_for_select2] = options.delete(:opts_for_select2) if options[:opts_for_select2]
          s[:can_create_on_empty_result] = options.delete(:can_create_on_empty_result) if options[:can_create_on_empty_result]
          s[:allow_html]  = true # Default value
          s[:allow_html]  = options.delete(:allow_html)  if options[:allow_html]
        end

        # Check for multiple is a special case dependent of input class
        set_multiple_option! self.class.superclass, sup, settings if options[:multiple]

        # Set language
        set_i18n_option! options, settings

        sup.deep_merge data: { ui: 'select2-simpleform', options: settings }
      end

      private

      def set_multiple_option!(input_class, defaults, js_settings)
        if input_class.equal? SimpleForm::Inputs::CollectionSelectInput
          defaults[:multiple] = true
        elsif input_class.equal? SimpleForm::Inputs::StringInput
          js_settings[:multiple] = options.delete(:multiple)
        end
        nil
      end

      def set_i18n_option!(input_options, js_settings)
        i18n_options = (input_options[:i18n] || {}).reverse_merge(Select2SimpleForm.i18n || {})
        js_settings[:i18n] = i18n_options if i18n_options.any?
        true
      end
    end
  end
end
