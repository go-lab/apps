#   $Id$
#   
#   File	Makefile
#   Part of	Experimental Design Tool
#   Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
#   Purpose	Creating JavaScript using cpp
#   
#   Notice	Copyright (c) 2013  University of Twente
#   
#   History	28/03/13  (Created)
#   		17/08/13  (Last modified)


.SUFFIXES:	.less .css .h .js

all:		splash.js  \
		splash.css \
		libs.js

a3.js:		../a3/expression.js
		cp ../a3/expression.js a3.js

cute.js:	/home/anjo/cute2/applications/cute/cute.js
		cp /home/anjo/cute2/applications/cute/cute.js cute.js

libs.js:	printf.js cute.js a3.js
		cat printf.js cute.js a3.js > libs.js

%.js:%.h
		gcc -E -x c -P -C $< > $@

%.css:%.less
		lessc $< $@

clean:		
		rm $(ALL)

