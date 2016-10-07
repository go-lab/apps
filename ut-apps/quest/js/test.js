(function() {
    "use strict";

    var stem = this.stem = (this.stem || require('./stem'));
    var is = stem.is = (stem.is || require('./is'));

    var ut = this.ut = this.ut || {};
    var libs = ut.libs = ut.libs || {};
    var tools = ut.tools = ut.tools || {};
    var commons = ut.commons = ut.commons || {};
    var utils = commons.utils = commons.utils || {};

    var quiz = tools.quiz = tools.quiz || {};

    var chemistry = stem.chemistry;

    var Parser = (is.in_nodejs() ? require('./parser') : tools.quiz.chemistry_parser);
    var Element = chemistry.Element;
    var Chemical = chemistry.Chemical;
    var Add = chemistry.Add;

    var str1 = 'Na+ + Cl- = NaCl';
    var str2 = 'Cl- + Na+ = ClNa';
    var a = Parser.parse(str1);
    console.log('a ' + a);
    var b = Parser.parse(str2);
    console.log('b ' + b);

    console.log('equivalent ' + a.equivalent(b));

    return;

/*
    var str1 = 'NaCl';
    var str2 = 'ClNa';

    var c1 = Parser.parse(str1);
    var c2 = Parser.parse(str2);

    printf('identical  c1 / c1 ' + c1.identical(c1));
    printf('identical  c1 / c2 ' + c1.identical(c2));

    printf('equivalent c1 / c1 ' + c1.equivalent(c1));
    printf('equivalent c1 / c2 ' + c1.equivalent(c2));
*/

    return;

    var str = '2 (OH)2Fe';
    var a = Parser.parse(str);
    console.log(str + ': ' + a);
    console.log(JSON.stringify(a,null,4));
    console.log(JSON.stringify(a.atom_frequencies(),null,4));
    return;

    var b = Parser.parse('Na^+', { student: true});
    console.log('Na ' + b);
    console.log(JSON.stringify(b,null,4));

    return;

    var c6 = new Chemical(['Fe(I(OH)2)3FeNa']);
    console.log(JSON.stringify(c6,null,4));
    console.log('c6 ' + c6 + ' ' + c6.toLatex() + ' ' + c6.toHtml());

    return;

    compound_toPrintable();

    function compound_toPrintable() {
        var c6 = Parser.parse('[(OH)2Fe]3H');
        console.log('c6 ' + c6 + ' ' + c6.toLatex() + ' ' + c6.toHtml());

        var c11 = Parser.parse('Fe(OH)2');
        console.log('c11 ' + c11 + ' ' + c11.toLatex() + ' ' + c11.toHtml());

        var c12 = Parser.parse('(Cl)2');
        console.log('c12 ' + c12);

        var c1 = Parser.parse('Na');
        console.log('c1 ' + c1 + ' ' + c1.toLatex() + ' ' + c1.toHtml());

        var c2 = Parser.parse('NaCl');
        console.log('c2 ' + c2 + ' ' + c2.toLatex() + ' ' + c2.toHtml());

        var c3 = Parser.parse('2 NaCl');
        console.log('c3 ' + c3 + ' ' + c3.toLatex() + ' ' + c3.toHtml());

        var c4 = Parser.parse('H2O');
        console.log('c4 ' + c4 + ' ' + c4.toLatex() + ' ' + c4.toHtml());

        var c5 = Parser.parse('(OH)2');
        console.log('c5 ' + c5 + ' ' + c5.toLatex() + ' ' + c5.toHtml());

        var c7 = Parser.parse('Fe+');
        console.log('c7 ' + c7 + ' ' + c7.toLatex() + ' ' + c7.toHtml());

        var c8 = Parser.parse('(OH)-');
        console.log('c8 ' + c8 + ' ' + c8.toLatex() + ' ' + c8.toHtml());

        var c9 = Parser.parse('Fe2');
        console.log('c9 ' + c9 + ' ' + c9.toLatex() + ' ' + c9.toHtml());

        var c10 = Parser.parse('Fe2+');
        console.log('c10 ' + c10 + ' ' + c10.toLatex() + ' ' + c10.toHtml());
    }


    function element_toPrintable() {
        var e1 = new Chemistry.Element('Na');
        console.log('e1 ' + e1 + ' ' + e1.toLatex() + ' ' + e1.toHtml());
        var e2 = new Chemistry.Element('Na', {subscript: 2});
        console.log('e2 ' + e2 + ' ' + e2.toLatex() + ' ' + e2.toHtml());
        var e3 = new Chemistry.Element('Na', {charge: 1});
        console.log('e3 ' + e3 + ' ' + e3.toLatex() + ' ' + e3.toHtml());
        var e4 = new Chemistry.Element('Na', {subscript: 3, charge: 1});
        console.log('e4 ' + e4 + ' ' + e4.toLatex() + ' ' + e4.toHtml());
        var e5 = new Chemistry.Element('Na', {subscript: 2, charge: -2});
        console.log('e5 ' + e5 + ' ' + e5.toLatex() + ' ' + e5.toHtml());
    }


/*
    var c2 = Parser.parse('2 HCl + 2 Na -> 2 NaCl + H2');
    printf('c2'); pp(c2);
    var c3 = Parser.parse('2 HCl + 2 Na -> 2 NaCl + H_2');
    printf('c3'); pp(c3);
*/

}).call(this);
