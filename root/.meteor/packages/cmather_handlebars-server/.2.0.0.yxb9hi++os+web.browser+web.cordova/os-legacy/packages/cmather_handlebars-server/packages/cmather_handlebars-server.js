(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/cmather:handlebars-server/handlebars-server.js           //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
OriginalHandlebars = Npm.require('handlebars');                      // 1
Handlebars = Handlebars || {};                                       // 2
                                                                     // 3
_.extend(Handlebars, {                                               // 4
  templates: {},                                                     // 5
});                                                                  // 6
                                                                     // 7
///////////////////////////////////////////////////////////////////////

}).call(this);
