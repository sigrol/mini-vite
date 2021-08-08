const fs=require('fs').promises
const path=require('path')
const reg = /^\/@modules\//
function pluginModuleResolve({app,root}){



    app.use(async (ctx,next)=>{

        if(!reg.test(ctx.path)){
            return  next()
        }

        const id = ctx.path.replace(reg,'')


        let mapping={
            vue:path.resolve(root,'node_modules','@vue/runtime-dom/dist/runtime-dom.esm-browser.js')
        }

        const content =await fs.readFile(mapping[id],'utf-8')

        ctx.type='js'
        ctx.body=content


    })
}



module.exports=pluginModuleResolve