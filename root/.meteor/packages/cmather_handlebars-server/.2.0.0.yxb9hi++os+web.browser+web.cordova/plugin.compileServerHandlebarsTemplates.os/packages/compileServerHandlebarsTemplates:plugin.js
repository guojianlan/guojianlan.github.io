(function () {

(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                               //
// plugin/compile-handlebars.js                                                                  //
//                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                 //
var path = Npm.require('path');                                                                  // 1
                                                                                                 // 2
Plugin.registerSourceHandler("handlebars", function (compileStep) {                              // 3
  var contents = compileStep.read().toString('utf8')                                             // 4
    , js;                                                                                        // 5
                                                                                                 // 6
  var path_part = path.dirname(compileStep.inputPath);                                           // 7
  if (path_part === '.')                                                                         // 8
    path_part = '';                                                                              // 9
                                                                                                 // 10
  if (path_part.length && path_part !== path.sep)                                                // 11
    path_part = path_part + path.sep;                                                            // 12
                                                                                                 // 13
  var ext = path.extname(compileStep.inputPath);                                                 // 14
  var basename = path.basename(compileStep.inputPath, ext);                                      // 15
  var templateName = path.basename(compileStep.inputPath).match(/(.*)\.handlebars$/)[1];         // 16
                                                                                                 // 17
  js = [                                                                                         // 18
    "Handlebars = Handlebars || {};",                                                            // 19
    "Handlebars.templates = Handlebars.templates || {} ;",                                       // 20
    "var template = OriginalHandlebars.compile(" + JSON.stringify(contents) + ");",              // 21
    "Handlebars.templates[" + JSON.stringify(templateName) + "] = function (data, partials) { ", // 22
    "partials = (partials || {});",                                                              // 23
    "return template(data || {}, { ",                                                            // 24
      "helpers: OriginalHandlebars.helpers,",                                                    // 25
      "partials: partials,",                                                                     // 26
      "name: " + JSON.stringify(templateName),                                                   // 27
     "});",                                                                                      // 28
    "};"                                                                                         // 29
  ].join('');                                                                                    // 30
                                                                                                 // 31
  compileStep.addJavaScript({                                                                    // 32
    path: path.join(path_part, 'handlebars.' + basename + '.js'),                                // 33
    sourcePath: compileStep.inputPath,                                                           // 34
    data: js                                                                                     // 35
  });                                                                                            // 36
});                                                                                              // 37
                                                                                                 // 38
///////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.compileServerHandlebarsTemplates = {};

})();

//# sourceMappingURL=compileServerHandlebarsTemplates:plugin.js.map
