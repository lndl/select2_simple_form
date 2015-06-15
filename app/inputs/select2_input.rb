class Select2Input < SimpleForm::Inputs::Base
  def input(wrapper_options)
    klass = if options.has_key? :collection
      generate_input_from SimpleForm::Inputs::CollectionSelectInput
            elsif options.has_key? :ajax
      generate_input_from SimpleForm::Inputs::StringInput
            end

    klass.new(@builder, @attribute_name, @column, @input_type, options).input wrapper_options
  end

  private

  def generate_input_from(input_class)
    Class.new(input_class) do
      def input_html_options
        settings = Hash.new.tap do |s|
          s[:url]      = options.delete(:url)      if options[:url]
          s[:multiple] = options.delete(:multiple) if options[:multiple]
          s[:ajax]     = options.delete(:ajax)     if options[:ajax]
          s[:sortable] = options.delete(:sortable) if options[:sortable]
          s[:can_create_on_empty_result] = options.delete(:can_create_on_empty_result) if options[:can_create_on_empty_result]
        end

        super.deep_merge data: { ui: 'select2-simpleform', options: settings }
      end
    end
  end
end
