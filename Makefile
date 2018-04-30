TEMPLATES = views/path-list.jade views/path-options.jade
OUTPUT = public/scripts/templates.js

templates: $(TEMPLATES)
	clientjade $(TEMPLATES) > $(OUTPUT)

install: templates
	npm install

run:
	node app.js
