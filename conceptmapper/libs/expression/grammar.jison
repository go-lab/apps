/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	grammar.jison
 *  Part of     Touching irresistible math objects (TIMO)
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Mathematics grammar
 *  Works with	jison
 *  
 *  Notice	Copyright (c) 2015  University of Twente
 *  
 *  History	10/11/15  (Created)
 *		24/11/15  (Last modified)
 */ 

%lex
%%

/*  WHEN ADDING SYMBOLS DO NOT FORGET TO ADD THE PRECEDENCE ALSO
 */

\s+                             /* skip whitespace */
([\-+]?\d+\.?\d*)([Ee][\-+]?\d+)?	return 'NUMBER'
"pi"                            return 'PI'
"e"                             return 'E'
"I"                             return 'I'
"log"                           return 'LOG'
"sqrt"                          return 'SQRT'
"sin"                           return 'SIN'
"cos"                           return 'COS'
"tan"                           return 'TAN'
[A-Za-z]+	                return 'VARIABLE';
"="                             return '='
"*"                             return '*'
"//"                            return '//'
"/"                             return '/'
":"                             return ':'
"-"                             return '-'
"+"                             return '+'
"^"                             return '^'
"!"                             return '!'
"\u005B"                        return '['
"\u005D"                        return ']'
"("                             return '('
")"                             return ')'
"{"                             return '{'
"}"                             return '}'
","                             return ','
"\u005F"                        return '_'
<<EOF>>                         return 'EOF'
.                               return 'INVALID'

/lex

/* operator associations and precedence */

%right '='
%left '+' '-'
%left '*' '/' '//'
%right '_' '^' ':'
%right '!'
%left UMINUS

%start expressions

%%

expressions:
          expression EOF
            { printf('expressions returns ' + $1);
              return $1; 
            }
        ;

expression:
          expression '=' expression
            { $$ = equals($1, $3); }
        | expression '+' expression
            { $$ = add($1, $3); }
	| expression '-' expression
            { $$ = subtract($1, $3); }
        | expression '*' expression
            { $$ = multiply($1, $3); }
        | expression '/' expression
            { $$ = divide($1, $3); }
        | expression '//' expression
            { $$ = fraction($1, $3); }
        | expression '_' expression
            { $$ = { functor: 'subscript', args: [$1, $3] }; }
        | expression '^' expression
            { $$ = power($1, $3); }
        | expression '!'
            { $$ = { functor: 'factorial', args: [$1] }; }
        | '-' expression %prec UMINUS
            { $$ = minus($2); }
        | '+' expression %prec UMINUS
            { $$ = minus($2); }
        | '(' expression ')'
            { $$ = $2; }
        | '{' expression '}'
            { $$ = { type: 'braces', arg: [$1] }; } 
        | NUMBER
            { $$ = make_numerical($1); }
        | SQRT '(' expression ')'
           { $$ = sqrt($3); }
        | SQRT '[' expression ']' '(' expression ')'
           { $$ = sqrt($6, $3); }
        | LOG '(' expression ')'
           { $$ = log($3); }
        | LOG '[' expression ']' '(' expression ')'
           { $$ = log($6, $3); }
/*
        | LOG '_' expression '(' expression ')'
           { $$ = log($5, $3); }
*/
        | SIN '(' expression ')'
           { $$ = sin($3); }
        | COS '(' expression ')'
           { $$ = cos($3); }
        | TAN '(' expression ')'
           { $$ = tan($3); }
        | VARIABLE '(' arguments ')'
           { $$ = { functor: 'function', name: $1, args: $3 }; }
/**/
        | VARIABLE ':' VARIABLE
           { var name1 = $1;
             var symb1 = Symbols.greek[name1];
             var name2= $3;
             var symb2 = Symbols.greek[name2];
             var name = name1 + ':' + name2;
             var subscript = { 
                 symbol: name2,
                 unicode: name2,
                 latex: name2
             };

             printf('V:V');
             printf('  name1 ' + name1);
             printf('  name2 ' + name2);

             if (symb2) {
                 subscript.greek = true;
                 subscript.latex = symb2.latex;
                 subscript.unicode = symb2.unicode;
             }

             if (symb1) {
               $$ = handle(variable(name, {
                 greek: true,
                 latex: symb1.latex,
                 unicode: symb1.unicode,
                 subscript: subscript
               })); 
             } else
                 $$ = handle(variable(name, {
                     latex: name1,
                     unicode: name1,
                     subscript: subscript
                 }));
           }
/**/
        | VARIABLE
           { var name = $1;
             var symb = Symbols.greek[name];

             if (symb)
               $$ = handle(variable(name, {
                 greek: true,
                 latex: symb.latex,
                 unicode: symb.unicode
               })); 
             else
               $$ = handle(variable(name));
           }
        | E
           { $$ = constant('E'); }
        | PI
           { $$ = constant('PI'); }
        ;

arguments:
           { $$ = [$1]; }
        | arguments2
           { $$ = $1; }
        ;

arguments2:
          expression
           { $$ = [$1]; }
        | arguments2 ',' expression
           { $$ = $1.concat([$3]); }
        ;
