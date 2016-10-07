#   $Id$
#   
#   File	Makefile
#   Part of	Go-Lab Reflection tool
#   Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
#   Purpose	Creating JavaScript, HTML and CSS scripts
#   
#   Notice	Copyright (c) 2014  University of Twente
#   
#   History	27/10/14  (Created)
#   		28/11/14  (Last modified)

.SUFFIXES:	.less .css .h .js .src .web

SOURCES =	module.js reflect.js model.js rules.js file.js messages.js phases.js \
		reflect.html \
		reflect.css

all:		$(SOURCES)
		mv *.js js
		mv *.css css

module.js:
		gcc -E -x c -P -C $< > js/$@

%.html:%.web
		gcc -E -x c -P -C $< > $@

%.css:%.less
		lessc $< $@

clean:		
		rm -f $(SOURCES)

