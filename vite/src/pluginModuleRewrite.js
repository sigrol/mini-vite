let readBody = require("./util");
let {parse} = require('es-module-lexer')
let MagicString = require('magic-string')

function moduleRewrite({app,root}){
    app.use(async (ctx,next)=>{
        await next()

       if(ctx.body&&ctx.response.is('js')){
           let r = await readBody(ctx.body)
           let res = rewriteImports(r)
           ctx.type='js'
           ctx.body=res
       }

    })
}


function rewriteImports(source){
  let res=parse(source)[0]

    let ms=new MagicString(source)

    for (let i=0;i<res.length;i++){
       let {s,e} = res[i]
       let id = source.slice(s,e)

        if(/^[^\/\.]/.test(id)){
            id = `/@modules/${id}`
            ms.overwrite(s,e,id)
        }

        if(/\.css/.test(id)){
            id = `${id}?import`
            ms.overwrite(s,e,id)
        }

    }

    return ms.toString()
}


module.exports=moduleRewrite