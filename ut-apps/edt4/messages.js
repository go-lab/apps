/*  $Id$	-*- mode: javascript -*-
 *  
 *  File        messages.js
 *  Part of     Go-Lab Experiment Design Tool
 *  Author      Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *              Siswa van Riesen, s.a.n.vanriesen@utwente.nl
 *              Nikoletta Xenofontos, xenofontos.nikoletta@ucy.ac.cy
 *              Leo Siiman, leosiiman@gmail.com
 *  Purpose     Messages with translations in various languages
 *  Works with  ECMAScript 5.1
 *  
 *  Notice      Copyright (c) 2013, 2014, 2015  University of Twente
 *  
 *  History     15/04/13  (Created)
 *		24/03/15  (Last modified)
 */

(function() {
    "use strict";

    var ut = this.ut = this.ut || {};
    var tools = ut.tools = ut.tools || {};
    var edt = tools.edt = tools.edt || {};
    var msg = edt.messages = {};

    function lab(obj, noendspace) {
        var l = (obj.label === 'function' ? obj.label() : obj.label);

        return ' <span class="edt_term">' + l + '</span>' +
            (noendspace ? '' : ' ');
    }

    function lc(obj, noendspace) {
        var l = (obj.label === 'function' ? obj.label(true) : obj.label);

        return ' <span class="edt_term">' + l + '</span>' +
            (noendspace ? '' : ' ');
    }

    msg.drop_independent_to_control = {
        en: function () {
            return '<p>You want to change <span class="edt_term">' +
                lc(this) + '</span> from "vary" to "keep constant".</p>' +
                '<p>This results in the values entered to be cleared.  Do you want to continue?</p>';
        },
        es: function () {
            return '<p>You want to change <span class="edt_term">' +
                lc(this) + '</span> from "vary" to "keep constant".</p>' +
                '<p>This results in the values entered to be cleared.  Do you want to continue?</p>';
        },
        et: function () {
            return '<p>Tahad <span class="domain_term">' +
                lc(this) + '</span> omaduse muutmise asemel samaks jätta.</p>' +
                '<p>Sel juhul puhastatakse juba sisestatud väärtused. Kas soovid sellegipoolest jätkata?</p>';
        },
        nl: function () {
            return '<p>Je wilt <span class="edt_term">' +
                lc(this) + '</span> veranderen van "varieer" naar "houd constant".</p>' +
                '<p>Dit heeft als gevolg dat de ingevulde waarden verdwijnen.  Wil je doorgaan?</p>';
        },
        el: function () {
            return '<p>Θέλεις να μετακινήσεις την ιδιότητα<span class="edt_term">' +
                lc(this) + '</span> από το Μεταβάλλω/Αλλάζω στο "Κρατώ σταθερό".</p>' +
                '<p>Αυτό θα έχει ως αποτέλεσμα να διαγραφούν οι τιμές που έχουν εισαχθεί. Είσαι σίγουρος/η ότι θέλεις να συνεχίσεις;</p>';
        }

    };

    msg.drop_expecting_dependent_variable_here = {
        en: function () {
            return '<p>It is not possible to measure <span class="edt_term">' +
                lc(this) + '</span> in the current lab.</p>' +
                '<p>Drag <span class="edt_term">' +
                lc(this) + '</span> ' + 'to a different box.</p>';
        },
        es: function () {
            return '<p>It is not possible to measure <span class="edt_term">' +
                lc(this) + '</span> in the current lab.</p>' +
                '<p>You can only "vary" or "keep constant" <span class="edt_term">' +
                lc(this) + '</span> ' + 'across experimental runs.</p>';
        },
        et: function () {
            return '<p>Selles laboris ei ole võimalik <span class="domain_term">' +
                lc(this) + '</span> mõõta.</p>' +
                '<p>Saad katsetes <span class="domain_term">' +
                lc(this) + '</span> ' + 'vaid muuta või samaks jätta.</p>';
        },
        nl: function () {
            return '<p>Het is niet mogelijk <span class="edt_term">' +
                lc(this) + '</span> te meten in het huidige lab.</p>' +
                '<p>Sleep <span class="edt_term">' +
                lc(this) + '</span> ' + 'naar een andere box.</p>';
        },
        el: function () {
            return '<p>Δεν είναι δυνατόν να μετρήσεις τη μεταβλητή <span class="edt_term">' +
                lc(this) + '</span> στο συγκεκριμένο εργαστήριο.</p>' +
                '<p>Μπορείς μόνο να "αλλάξεις" ή "να κρατήσεις σταθερή" τη μεταβλητή <span class="edt_term">' +
                lc(this) + '</span> ' + 'κατά τη διάρκεια των πειραματικών δοκιμών.</p>';
        }
    };

    msg.drop_expecting_independent_variable_here = {
        en: function () {
            return '<p>It is not possible to place <span class="edt_term">' + lab(this) +
                '</span> this variable here.</p>' +
                '<p>You can only measure <span class="edt_term">' + lab(this) + '</span>.</p>';
        },
        es: function () {
            return '<p>It is not possible to vary <span class="edt_term">' + lab(this) +
                '</span> in the current lab.</p>' +
                '<p>You can only measure <span class="edt_term">' + lab(this) + '</span>.</p>';
        },
        et: function () {
            return '<p>Selles laboris ei ole võimalik <span class="domain_term">' + lab(this) +
                '</span> muuta.</p>' +
                '<p>Saad <span class="domain_term">' + lab(this) + '</span> vaid mõõta.</p>';
        },
        nl: function () {
            return '<p>Het is niet mogelijk <span class="edt_term">' + lab(this) +
                '</span> hier te plaatsen.</p>' +
                '<p>Je kunt <span class="edt_term">' + lab(this) + '</span> alleen meten.</p>';
        },
        el: function () {
            return '<p>Δεν είναι δυνατόν να αλλάξεις τη μεταβλητή <span class="edt_term">' + lab(this) +
                '</span> στο συγκεκριμένο εργαστήριο.</p>' +
                '<p>Μπορείς μόνο να μετρήσεις τη μεταβλητή <span class="edt_term">' + lab(this) + '</span>.</p>';
        }
    };

    msg.drop_expecting_control_variable_here = {
        en: function () {
            return '<p>It is not possible to place <span class="edt_term">' + lab(this) +
                '</span> this variable here.</p>' +
                '<p>You can only measure <span class="edt_term">' + lab(this) + '</span>.</p>';
        },
        es: function () {
            return '<p>It is not possible to keep <span class="edt_term">' + lab(this) +
                '</span> constant in the current lab.</p>' +
                '<p>You can only measure <span class="edt_term">' + lab(this) + '</span>.</p>';
        },
        et: function () {
            return '<p>Selles laboris ei ole võimalik <span class="domain_term">' + lab(this) +
                '</span> samaks jätta.</p>' +
                '<p>Saad <span class="domain_term">' + lab(this) + '</span> vaid mõõta.</p>';
        },
        nl: function () {
            return '<p>Het is niet mogelijk <span class="edt_term">' + lab(this) +
                '</span> hier te plaatsen.</p>' +
                '<p>Je kunt <span class="edt_term">' + lab(this) + '</span> alleen meten.</p>';
        },
        el: function () {
            return '<p>Δεν είναι δυνατόν να καρατήσεις σταθερή τη μεταβλητή <span class="edt_term">' + lab(this) +
                '</span> στο συγκεκριμένο εργαστήριο.</p>' +
                '<p>Μπορείς μόνο να μετρήσεις τη μεταβλητή <span class="edt_term">' + lab(this) + '</span>.</p>';
        }
    };
}).call(this);