
jade = (function(exports){
/*!
 * Jade - runtime
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Lame Array.isArray() polyfill for now.
 */

if (!Array.isArray) {
  Array.isArray = function(arr){
    return '[object Array]' == Object.prototype.toString.call(arr);
  };
}

/**
 * Lame Object.keys() polyfill for now.
 */

if (!Object.keys) {
  Object.keys = function(obj){
    var arr = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        arr.push(key);
      }
    }
    return arr;
  }
}

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    ac = ac.filter(nulls);
    bc = bc.filter(nulls);
    a['class'] = ac.concat(bc).join(' ');
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function nulls(val) {
  return val != null;
}

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 * @api private
 */

exports.attrs = function attrs(obj, escaped){
  var buf = []
    , terse = obj.terse;

  delete obj.terse;
  var keys = Object.keys(obj)
    , len = keys.length;

  if (len) {
    buf.push('');
    for (var i = 0; i < len; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('boolean' == typeof val || null == val) {
        if (val) {
          terse
            ? buf.push(key)
            : buf.push(key + '="' + key + '"');
        }
      } else if (0 == key.indexOf('data') && 'string' != typeof val) {
        buf.push(key + "='" + JSON.stringify(val) + "'");
      } else if ('class' == key && Array.isArray(val)) {
        buf.push(key + '="' + exports.escape(val.join(' ')) + '"');
      } else if (escaped && escaped[key]) {
        buf.push(key + '="' + exports.escape(val) + '"');
      } else {
        buf.push(key + '="' + val + '"');
      }
    }
  }

  return buf.join(' ');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  return String(html)
    .replace(/&(?!(\w+|\#\d+);)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno){
  if (!filename) throw err;

  var context = 3
    , str = require('fs').readFileSync(filename, 'utf8')
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

  return exports;

})({});

jade.templates = {};
jade.render = function(node, template, data) {
  var tmp = jade.templates[template](data);
  node.innerHTML = tmp;
};

jade.templates["path-list"] = function(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<table>');
// iterate paths
;(function(){
  if ('number' == typeof paths.length) {
    for (var $index = 0, $$l = paths.length; $index < $$l; $index++) {
      var path = paths[$index];

buf.push('<tr><td');
buf.push(attrs({ 'data-pathname':("" + (path.name) + "") }, {"data-pathname":true}));
buf.push('><p');
buf.push(attrs({ "class": ("" + (path.name === selected ? 'selected-list-element':'') + "") + ' ' + ('list-element') }, {}));
buf.push('>   <input');
buf.push(attrs({ 'type':("checkbox"), 'checked':((visibilities[path.name] ? "checked" : undefined)), "class": ('pathVisibility') }, {"type":true,"checked":true}));
buf.push('/>');
if ( editingPathname === path.name)
{
buf.push('<input');
buf.push(attrs({ 'type':("text"), 'value':("" + (path.name) + ""), "class": ('pathNameInput') }, {"type":true,"value":true}));
buf.push('/>');
}
else
{
buf.push('<span class="pathName">');
var __val__ = path.name
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span>');
}
buf.push('<span class="fa fa-trash deletepath"></span></p>');
if ( selected === path.name)
{
buf.push('<div class="path-options">Vitesse de croisi&egrave;re :&nbsp;<input');
buf.push(attrs({ 'type':("number"), 'value':("" + (path.cruiseSpeed) + ""), "class": ('cruiseSpeed') }, {"type":true,"value":true}));
buf.push('/>&nbsp;m/s<br/>Vitesse de fin :&nbsp;<input');
buf.push(attrs({ 'type':("number"), 'value':("" + (path.endSpeed) + ""), "class": ('endSpeed') }, {"type":true,"value":true}));
buf.push('/>&nbsp;m/s<br/><input');
buf.push(attrs({ 'type':("checkbox"), 'checked':((path.teamMirror ? "checked" : undefined)), "class": ('teamMirror') }, {"type":true,"checked":true}));
buf.push('/>Mirroir &eacute;quipes<br/><input');
buf.push(attrs({ 'type':("checkbox"), 'checked':((path.green[tableConfig].configLink != -1 ? "checked" : undefined)), "class": ('configLinkEnable') }, {"type":true,"checked":true}));
buf.push('/>Config actuelle identique &agrave; config&nbsp;');
if ( path.green[tableConfig].configLink == -1)
{
buf.push('<select disabled="disabled" class="configLink"><option value="0">1</option><option value="1">2</option><option value="2">3</option><option value="3">4</option><option value="4">5</option></select>');
}
else
{
buf.push('<select class="configLink"><option');
buf.push(attrs({ 'value':("0"), 'selected':((path.green[tableConfig].configLink == 0 ? "selected" : undefined)) }, {"value":true,"selected":true}));
buf.push('>1</option><option');
buf.push(attrs({ 'value':("1"), 'selected':((path.green[tableConfig].configLink == 1 ? "selected" : undefined)) }, {"value":true,"selected":true}));
buf.push('>2</option><option');
buf.push(attrs({ 'value':("2"), 'selected':((path.green[tableConfig].configLink == 2 ? "selected" : undefined)) }, {"value":true,"selected":true}));
buf.push('>3</option><option');
buf.push(attrs({ 'value':("3"), 'selected':((path.green[tableConfig].configLink == 3 ? "selected" : undefined)) }, {"value":true,"selected":true}));
buf.push('>4</option><option');
buf.push(attrs({ 'value':("4"), 'selected':((path.green[tableConfig].configLink == 4 ? "selected" : undefined)) }, {"value":true,"selected":true}));
buf.push('>5</option></select>');
}
buf.push('<br/><br/>Cap initial :&nbsp;<input');
buf.push(attrs({ 'type':("number"), 'value':("" + (path[selectedTeam][tableConfig].initAngle) + ""), "class": ('initAngle') }, {"type":true,"value":true}));
buf.push('/>&nbsp;&deg;<br/>Points :<table class="points-table">');
if ( path[selectedTeam][tableConfig].points.length == 0)
{
buf.push('<br/><p style="text-align:center; margin:0">cliquer sur la table pour ajouter des points</p>');
}
else
{
var i = 0;
// iterate path[selectedTeam][tableConfig].points
;(function(){
  if ('number' == typeof path[selectedTeam][tableConfig].points.length) {
    for (var $index = 0, $$l = path[selectedTeam][tableConfig].points.length; $index < $$l; $index++) {
      var point = path[selectedTeam][tableConfig].points[$index];

buf.push('<tr><td class="points-index">');
var __val__ = ++i
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</td><td>x : &nbsp;<input');
buf.push(attrs({ 'type':("number"), 'value':("" + (point.x) + ""), 'data-index':("" + (i-1) + ""), "class": ('point-x') }, {"type":true,"value":true,"data-index":true}));
buf.push('/></td><td>y : &nbsp;<input');
buf.push(attrs({ 'type':("number"), 'value':("" + (point.y) + ""), 'data-index':("" + (i-1) + ""), "class": ('point-y') }, {"type":true,"value":true,"data-index":true}));
buf.push('/></td></tr>');
    }
  } else {
    for (var $index in path[selectedTeam][tableConfig].points) {
      var point = path[selectedTeam][tableConfig].points[$index];

buf.push('<tr><td class="points-index">');
var __val__ = ++i
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</td><td>x : &nbsp;<input');
buf.push(attrs({ 'type':("number"), 'value':("" + (point.x) + ""), 'data-index':("" + (i-1) + ""), "class": ('point-x') }, {"type":true,"value":true,"data-index":true}));
buf.push('/></td><td>y : &nbsp;<input');
buf.push(attrs({ 'type':("number"), 'value':("" + (point.y) + ""), 'data-index':("" + (i-1) + ""), "class": ('point-y') }, {"type":true,"value":true,"data-index":true}));
buf.push('/></td></tr>');
   }
  }
}).call(this);

}
buf.push('</table></div>');
}
buf.push('</td></tr>');
    }
  } else {
    for (var $index in paths) {
      var path = paths[$index];

buf.push('<tr><td');
buf.push(attrs({ 'data-pathname':("" + (path.name) + "") }, {"data-pathname":true}));
buf.push('><p');
buf.push(attrs({ "class": ("" + (path.name === selected ? 'selected-list-element':'') + "") + ' ' + ('list-element') }, {}));
buf.push('>   <input');
buf.push(attrs({ 'type':("checkbox"), 'checked':((visibilities[path.name] ? "checked" : undefined)), "class": ('pathVisibility') }, {"type":true,"checked":true}));
buf.push('/>');
if ( editingPathname === path.name)
{
buf.push('<input');
buf.push(attrs({ 'type':("text"), 'value':("" + (path.name) + ""), "class": ('pathNameInput') }, {"type":true,"value":true}));
buf.push('/>');
}
else
{
buf.push('<span class="pathName">');
var __val__ = path.name
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span>');
}
buf.push('<span class="fa fa-trash deletepath"></span></p>');
if ( selected === path.name)
{
buf.push('<div class="path-options">Vitesse de croisi&egrave;re :&nbsp;<input');
buf.push(attrs({ 'type':("number"), 'value':("" + (path.cruiseSpeed) + ""), "class": ('cruiseSpeed') }, {"type":true,"value":true}));
buf.push('/>&nbsp;m/s<br/>Vitesse de fin :&nbsp;<input');
buf.push(attrs({ 'type':("number"), 'value':("" + (path.endSpeed) + ""), "class": ('endSpeed') }, {"type":true,"value":true}));
buf.push('/>&nbsp;m/s<br/><input');
buf.push(attrs({ 'type':("checkbox"), 'checked':((path.teamMirror ? "checked" : undefined)), "class": ('teamMirror') }, {"type":true,"checked":true}));
buf.push('/>Mirroir &eacute;quipes<br/><input');
buf.push(attrs({ 'type':("checkbox"), 'checked':((path.green[tableConfig].configLink != -1 ? "checked" : undefined)), "class": ('configLinkEnable') }, {"type":true,"checked":true}));
buf.push('/>Config actuelle identique &agrave; config&nbsp;');
if ( path.green[tableConfig].configLink == -1)
{
buf.push('<select disabled="disabled" class="configLink"><option value="0">1</option><option value="1">2</option><option value="2">3</option><option value="3">4</option><option value="4">5</option></select>');
}
else
{
buf.push('<select class="configLink"><option');
buf.push(attrs({ 'value':("0"), 'selected':((path.green[tableConfig].configLink == 0 ? "selected" : undefined)) }, {"value":true,"selected":true}));
buf.push('>1</option><option');
buf.push(attrs({ 'value':("1"), 'selected':((path.green[tableConfig].configLink == 1 ? "selected" : undefined)) }, {"value":true,"selected":true}));
buf.push('>2</option><option');
buf.push(attrs({ 'value':("2"), 'selected':((path.green[tableConfig].configLink == 2 ? "selected" : undefined)) }, {"value":true,"selected":true}));
buf.push('>3</option><option');
buf.push(attrs({ 'value':("3"), 'selected':((path.green[tableConfig].configLink == 3 ? "selected" : undefined)) }, {"value":true,"selected":true}));
buf.push('>4</option><option');
buf.push(attrs({ 'value':("4"), 'selected':((path.green[tableConfig].configLink == 4 ? "selected" : undefined)) }, {"value":true,"selected":true}));
buf.push('>5</option></select>');
}
buf.push('<br/><br/>Cap initial :&nbsp;<input');
buf.push(attrs({ 'type':("number"), 'value':("" + (path[selectedTeam][tableConfig].initAngle) + ""), "class": ('initAngle') }, {"type":true,"value":true}));
buf.push('/>&nbsp;&deg;<br/>Points :<table class="points-table">');
if ( path[selectedTeam][tableConfig].points.length == 0)
{
buf.push('<br/><p style="text-align:center; margin:0">cliquer sur la table pour ajouter des points</p>');
}
else
{
var i = 0;
// iterate path[selectedTeam][tableConfig].points
;(function(){
  if ('number' == typeof path[selectedTeam][tableConfig].points.length) {
    for (var $index = 0, $$l = path[selectedTeam][tableConfig].points.length; $index < $$l; $index++) {
      var point = path[selectedTeam][tableConfig].points[$index];

buf.push('<tr><td class="points-index">');
var __val__ = ++i
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</td><td>x : &nbsp;<input');
buf.push(attrs({ 'type':("number"), 'value':("" + (point.x) + ""), 'data-index':("" + (i-1) + ""), "class": ('point-x') }, {"type":true,"value":true,"data-index":true}));
buf.push('/></td><td>y : &nbsp;<input');
buf.push(attrs({ 'type':("number"), 'value':("" + (point.y) + ""), 'data-index':("" + (i-1) + ""), "class": ('point-y') }, {"type":true,"value":true,"data-index":true}));
buf.push('/></td></tr>');
    }
  } else {
    for (var $index in path[selectedTeam][tableConfig].points) {
      var point = path[selectedTeam][tableConfig].points[$index];

buf.push('<tr><td class="points-index">');
var __val__ = ++i
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</td><td>x : &nbsp;<input');
buf.push(attrs({ 'type':("number"), 'value':("" + (point.x) + ""), 'data-index':("" + (i-1) + ""), "class": ('point-x') }, {"type":true,"value":true,"data-index":true}));
buf.push('/></td><td>y : &nbsp;<input');
buf.push(attrs({ 'type':("number"), 'value':("" + (point.y) + ""), 'data-index':("" + (i-1) + ""), "class": ('point-y') }, {"type":true,"value":true,"data-index":true}));
buf.push('/></td></tr>');
   }
  }
}).call(this);

}
buf.push('</table></div>');
}
buf.push('</td></tr>');
   }
  }
}).call(this);

buf.push('<tr><td class="add-element"><a class="btn add-element-btn"><span class="fa fa-plus"></span>ajouter un chemin </a></td></tr></table>');
}
return buf.join("");
}
jade.templates["path-options"] = function(locals, attrs, escape, rethrow, merge
/**/) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="path-options">Vitesse de croisi&egrave;re :&nbsp;<input');
buf.push(attrs({ 'type':("number"), 'value':("" + (path.cruiseSpeed) + ""), "class": ('cruiseSpeed') }, {"type":true,"value":true}));
buf.push('/>&nbsp;m/s<br/>Vitesse de fin :&nbsp;<input');
buf.push(attrs({ 'type':("number"), 'value':("" + (path.endSpeed) + ""), "class": ('endSpeed') }, {"type":true,"value":true}));
buf.push('/>&nbsp;m/s<br/><input');
buf.push(attrs({ 'type':("checkbox"), 'checked':((path.teamMirror ? "checked" : undefined)), "class": ('teamMirror') }, {"type":true,"checked":true}));
buf.push('/>Mirroir &eacute;quipes<br/><input');
buf.push(attrs({ 'type':("checkbox"), 'checked':((path.green[tableConfig].configLink != -1 ? "checked" : undefined)), "class": ('configLinkEnable') }, {"type":true,"checked":true}));
buf.push('/>Config actuelle identique &agrave; config&nbsp;');
if ( path.green[tableConfig].configLink == -1)
{
buf.push('<select disabled="disabled" class="configLink"><option value="0">1</option><option value="1">2</option><option value="2">3</option><option value="3">4</option><option value="4">5</option></select>');
}
else
{
buf.push('<select class="configLink"><option');
buf.push(attrs({ 'value':("0"), 'selected':((path.green[tableConfig].configLink == 0 ? "selected" : undefined)) }, {"value":true,"selected":true}));
buf.push('>1</option><option');
buf.push(attrs({ 'value':("1"), 'selected':((path.green[tableConfig].configLink == 1 ? "selected" : undefined)) }, {"value":true,"selected":true}));
buf.push('>2</option><option');
buf.push(attrs({ 'value':("2"), 'selected':((path.green[tableConfig].configLink == 2 ? "selected" : undefined)) }, {"value":true,"selected":true}));
buf.push('>3</option><option');
buf.push(attrs({ 'value':("3"), 'selected':((path.green[tableConfig].configLink == 3 ? "selected" : undefined)) }, {"value":true,"selected":true}));
buf.push('>4</option><option');
buf.push(attrs({ 'value':("4"), 'selected':((path.green[tableConfig].configLink == 4 ? "selected" : undefined)) }, {"value":true,"selected":true}));
buf.push('>5</option></select>');
}
buf.push('<br/><br/>Cap initial :&nbsp;<input');
buf.push(attrs({ 'type':("number"), 'value':("" + (path[selectedTeam][tableConfig].initAngle) + ""), "class": ('initAngle') }, {"type":true,"value":true}));
buf.push('/>&nbsp;&deg;<br/>Points :<table class="points-table">');
if ( path[selectedTeam][tableConfig].points.length == 0)
{
buf.push('<br/><p style="text-align:center; margin:0">cliquer sur la table pour ajouter des points</p>');
}
else
{
var i = 0;
// iterate path[selectedTeam][tableConfig].points
;(function(){
  if ('number' == typeof path[selectedTeam][tableConfig].points.length) {
    for (var $index = 0, $$l = path[selectedTeam][tableConfig].points.length; $index < $$l; $index++) {
      var point = path[selectedTeam][tableConfig].points[$index];

buf.push('<tr><td class="points-index">');
var __val__ = ++i
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</td><td>x : &nbsp;<input');
buf.push(attrs({ 'type':("number"), 'value':("" + (point.x) + ""), 'data-index':("" + (i-1) + ""), "class": ('point-x') }, {"type":true,"value":true,"data-index":true}));
buf.push('/></td><td>y : &nbsp;<input');
buf.push(attrs({ 'type':("number"), 'value':("" + (point.y) + ""), 'data-index':("" + (i-1) + ""), "class": ('point-y') }, {"type":true,"value":true,"data-index":true}));
buf.push('/></td></tr>');
    }
  } else {
    for (var $index in path[selectedTeam][tableConfig].points) {
      var point = path[selectedTeam][tableConfig].points[$index];

buf.push('<tr><td class="points-index">');
var __val__ = ++i
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</td><td>x : &nbsp;<input');
buf.push(attrs({ 'type':("number"), 'value':("" + (point.x) + ""), 'data-index':("" + (i-1) + ""), "class": ('point-x') }, {"type":true,"value":true,"data-index":true}));
buf.push('/></td><td>y : &nbsp;<input');
buf.push(attrs({ 'type':("number"), 'value':("" + (point.y) + ""), 'data-index':("" + (i-1) + ""), "class": ('point-y') }, {"type":true,"value":true,"data-index":true}));
buf.push('/></td></tr>');
   }
  }
}).call(this);

}
buf.push('</table></div>');
}
return buf.join("");
}