const static = require('koa-static')
function pluginServerStatic({app,root}){
    app.use(static(root))
}

module.exports=pluginServerStatic