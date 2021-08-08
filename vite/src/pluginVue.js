const fs=require('fs').promises
const path = require('path')


function styleRender(content){
    let cssCode=''
    let styleContent = JSON.stringify(content)
    let time=new Date().getTime()
    const uid = Math.floor(Math.random()*1000)+time
    cssCode += `import { updateStyle } from "/vite/src/client.js"`
    cssCode += `\nconst css = ${styleContent}`
    cssCode +=`\nupdateStyle(${uid}, css)`
    cssCode +=`\nexport default css`

    return cssCode
}


function pluginVue({app,root}){
    app.use(async (ctx,next)=>{

        if(ctx.path.endsWith('.css')){

            const filePath = path.join(root,ctx.path)
            const content = await fs.readFile(filePath,'utf-8')

            ctx.type = 'js'
            ctx.body = styleRender(content)

        }else if(ctx.path.endsWith('.vue')){

            const filePath = path.join(root,ctx.path)
            const content =await fs.readFile(filePath,'utf-8')
            const {parse,compileTemplate} = require(path.resolve(root,'node_modules','@vue/compiler-sfc/dist/compiler-sfc.cjs'))

            let {descriptor}=parse(content)
            if(!ctx.query.type){

                let code=''

                if(descriptor.script){
                    let content = descriptor.script.content
                    code+= content.replace(/((?:^|\n|;)\s*)export default/,'$1const __script=')
                }

                if(descriptor.template){

                    if(descriptor.styles&&descriptor.styles[0]){
                        code +='import'+'\t' + JSON.stringify(`${ctx.path}?type=style&index=0`);
                    }
                    // code +=ctx.path+`?type=style&index=0`;
                    const requestPath=ctx.path+`?type=template`;
                    code +=`\nimport {render as __render} from "${requestPath}"`
                    code += `\n__script.render = __render`
                }
                code += `\nexport default __script`

                ctx.type='js'
                ctx.body=code
            }

            if(ctx.query.type=='template'){
                ctx.type='js'
                let content=descriptor.template.content
                let {code} = compileTemplate({source:content})
                ctx.body=code
            }

            if(ctx.query.type=='style'){
                let styles=''
                if(descriptor.styles){
                    descriptor.styles.forEach(style=>{
                        styles += style.content
                    })
                }

                ctx.type = 'js'
                ctx.body = styleRender(styles)
            }


        }else {
            return next()
        }






    })
}

module.exports=pluginVue