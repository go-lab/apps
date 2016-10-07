#   $Id$
#   
#   File	Makefile
#   Part of	Go-Lab Reflection tool
#   Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
#   Purpose	Creating JavaScript, HTML and CSS scripts
#   
#   Notice	Copyright (c) 2014, 2015  University of Twente
#   
#   History	27/10/14  (Created)
#   		16/06/15  (Last modified)

.SUFFIXES:	.less .css .h .js .src .web

SOURCES =		js/module.js js/reflect.js js/model.js js/file.js js/phases.js \
			js/xrange.js \
			css/reflect.css 

READY =			reflect.html reflect1.html reflect2.html

all:			$(SOURCES)

js/file.js:		file.js
			gcc -E -x c -P -C -include ../../libs/h/js.h $< > $@

js/model.js:		model.js
			gcc -E -x c -P -C -include ../../libs/h/js.h $< > $@

js/module.js:		module.js ALWAYS
			gcc -E -x c -P -C -include ../../libs/h/js.h $< > $@

js/phases.js:		phases.js
			gcc -E -x c -P -C -include ../../libs/h/js.h $< > $@

js/reflect.js:		reflect.js
			gcc -E -x c -P -C -include ../../libs/h/js.h $< > $@

js/xrange.js:		xrange.js
			gcc -E -x c -P -C -include ../../libs/h/js.h $< > $@

css/reflect.css:	reflect.less
			lessc $< css/$@

ALWAYS:			;

clean:		
			rm -f $(SOURCES)

