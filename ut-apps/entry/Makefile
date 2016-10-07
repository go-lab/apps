#   $Id$
#   
#   File		Makefile
#   Part of		Go-Lab Entry Tool
#   Author		Anjo Anjewierden, a.a.anjewierden@utwente.nl
#   Purpose		Creating JavaScript, HTML and CSS scripts
#   
#   Notice		Copyright (c) 2016  University of Twente
#   
#   History		01/03/16  (Created)
#			01/03/16  (Last modified)

.SUFFIXES:		.less .css .h .js

SOURCES =		js/model.js js/resource.js js/entry.js js/module.js \
			js/is.js js/sortable.js js/ui-bootstrap.js \
			css/entry.css

all:			$(SOURCES)

js/entry.js:		entry.js
			gcc -E -x c -P -C -include ../../libs/h/js.h $< > $@

js/is.js:		../../tools/track/js/is.js
			gcc -E -x c -P -C -include ../../libs/h/js.h $< > $@

js/model.js:		model.js
			gcc -E -x c -P -C -include ../../libs/h/js.h $< > $@

js/module.js:		module.js ALWAYS
			gcc -E -x c -P -C -include ../../libs/h/js.h $< > $@

js/resource.js:		resource.js
			gcc -E -x c -P -C -include ../../libs/h/js.h $< > $@

js/sortable.js:		libs/sortable.js
			cp $< $@

js/ui-bootstrap.js:	libs/ui-bootstrap.js
			cp $< $@

ALWAYS:			;

css/entry.css:		entry.less
			lessc $< $@

clean:		
			rm -f $(SOURCES)

