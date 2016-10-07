#   $Id$
#   
#   File		Makefile
#   Part of		Go-Lab Questionnaire tool
#   Author		Anjo Anjewierden, a.a.anjewierden@utwente.nl
#   Purpose		Creating JavaScript, HTML and CSS scripts
#   
#   Notice		Copyright (c) 2016  University of Twente
#   
#   History		30/06/16  (Created)
#			30/06/16  (Last modified)

.SUFFIXES:		.less .css .h .js

SOURCES =		js/model.js js/resource.js js/quest.js js/module.js \
			js/teacher.js css/quest.css \
			js/ui-bootstrap.js js/sortable.js

all:			$(SOURCES)

js/test.js:		test.js
			gcc -E -x c -P -C -include ../../libs/h/js.h $< > $@

js/ui-bootstrap.js:	libs/ui-bootstrap.js
			cp $< $@

js/sortable.js	:	libs/sortable.js
			cp $< $@

js/quest.js:		quest.js
			gcc -E -x c -P -C -include ../../libs/h/js.h $< > $@

js/model.js:		model.js
			gcc -E -x c -P -C -include ../../libs/h/js.h $< > $@

js/teacher.js:		teacher.js
			gcc -E -x c -P -C -include ../../libs/h/js.h $< > $@

js/module.js:		module.js ALWAYS
			gcc -E -x c -P -C -include ../../libs/h/js.h $< > $@

js/resource.js:		resource.js
			gcc -E -x c -P -C -include ../../libs/h/js.h $< > $@

ALWAYS:			;

css/quest.css:		quest.less
			lessc $< $@

clean:		
			rm -f $(SOURCES)

