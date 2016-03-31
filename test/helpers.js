import path from 'path';

module.exports = {
  stripScripts: function (buffer) {
    var html = buffer.toString();
    var scriptTag = /<script[\s\S]*?>[\s\S]*?<\/script>/gi
    return new Buffer(html.replace(scriptTag, ''));
  }
};