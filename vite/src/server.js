const Koa = require('koa')
const pluginServerStatic = require('./pluginServerStatic')
const pluginModuleRewrite = require('./pluginModuleRewrite')
const pluginModuleResolve = require('./pluginModuleResolve')
const pluginVue = require('./pluginVue')


function createServer(){
    const app = new Koa();

    const context={
       app,
       root:process.cwd()
    }



    const resolvePlugin = [
        pluginModuleRewrite,  //重新vue => /@modules/vue
        pluginModuleResolve,   //去掉/@modules/vue  => vue
        pluginVue,
        pluginServerStatic     //获取静态文件
    ]

    resolvePlugin.forEach(plugin=>plugin(context))

    return app
}

createServer().listen('4000',()=>{
    console.log('start server 4000')
})