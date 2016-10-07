#   $Id$
#   
#   File	Makefile
#   Part of	Chemical Equation Entry
#   Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
#   Purpose	Creating JavaScript, HTML and CSS scripts
#   
#   Notice	Copyright (c) 2015  University of Twente
#   
#   History	10/02/15  (Created)
#   		12/04/15  (Last modified)

.SUFFIXES:	.less .css .h .js .src .web

SOURCES =		js/module.js js/file.js js/chempy.js js/chemistry.js \
			chempy.html \
			css/chempy.css

all:			$(SOURCES)

ALWAYS:			;

js/chemistry.js:	chemistry.js
			gcc -E -x c -P -C -include ../../libs/h/js.h $< > $@

js/chempy.js:		chempy.js
			gcc -E -x c -P -C -include ../../libs/h/js.h $< > $@

js/file.js:		file.js
			gcc -E -x c -P -C -include ../../libs/h/js.h $< > $@

js/module.js:		module.js ALWAYS
			gcc -E -x c -P -C -include ../../libs/h/js.h $< > $@

%.html:%.web
			gcc -E -x c -P -C $< > $@

css/chempy.css:		chempy.less
			lessc $< $@

clean:		
			rm -f $(SOURCES)

