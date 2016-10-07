#   $Id$
#   
#   File	Makefile
#   Part of	Experiment Design Tool
#   Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
#   Purpose	Creating JavaScript, HTML and CSS scripts
#   
#   Notice	Copyright (c) 2013, 2014, 2015  University of Twente
#   
#   History	17/12/13  (Created)
#		13/02/15  (Last modified)

.SUFFIXES:		.less .css .h .js .src .web

SOURCES =		js/edt.js js/resource.js js/model.js js/messages.js js/module.js \
			js/parse_number.js js/js-quantities.js js/quantity.js css/edt.css \
			js/is.js \
			js/expression.js

SUPPORT =		edt.html edt.xml design.html

all:			$(SOURCES)

js/expression.js:	../../tools/expression/js/all.js
			cp $< $@

js/edt.js:		edt.js
			gcc -E -x c -P -C -include ../../libs/h/js.h $< > $@

js/is.js:		../../tools/track/js/is.js
			gcc -E -x c -P -C -include ../../libs/h/js.h $< > $@

js/model.js:		model.js
			gcc -E -x c -P -C -include ../../libs/h/js.h $< > $@

js/messages.js:		messages.js
			gcc -E -x c -P -C -include ../../libs/h/js.h $< > $@

js/module.js:		module.js ALWAYS
			gcc -E -x c -P -C -include ../../libs/h/js.h $< > $@

js/parse_number.js:	parse_number.js
			gcc -E -x c -P -C -include ../../libs/h/js.h $< > $@

js/resource.js:		resource.js
			gcc -E -x c -P -C -include ../../libs/h/js.h $< > $@

js/quantity.js:		quantity.js
			gcc -E -x c -P -C -include ../../libs/h/js.h $< > $@

js/js-quantities.js:	js-quantities.js
			cp $< $@

ALWAYS:			;

css/edt.css:		edt.less
			lessc $< $@

clean:		
			rm -f $(SOURCES)

