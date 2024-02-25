import { NodeTypes } from "./ast"
import { TO_DISPLAY_STRING, helperMapName } from "./runtimeHelpers"

export function generate(ast){
    const context = createCodegenContext()

    const {push} = context

    genFunctionPreamble(ast, context)

    const functionName = "render"
    const args = ["_ctx", "_cache"]
    const signature = args.join(", ")
    console.log(ast)

    push(`function ${functionName}(${signature}) {`)

    push(`return `)
    genNode(ast.codegenNode, context)
    push("}")


    return {
        code: context.code
    }
}

function genFunctionPreamble(ast: any, context: any) {
    const {push} = context
    const VueBinging = "Vue"

    // const helpers = ["toDisplayString"] // ast.helpers
    const aliasHelpers = (s) => `${helperMapName[s]}: _${helperMapName[s]}`
    if(ast.helpers.length > 0){
        push(
            `const { ${ast.helpers.map(aliasHelpers).join(", ")} } = ${VueBinging}`
        )
    }

    //  添加个回车
    push("\n")

    // return 
    push("return ")
}

function createCodegenContext(): any{
    const context = {
        code: "",
        push(source){
            context.code += source
        },
        helper(key){
            return `_${helperMapName[key]}`
        }
    }
    return context
}

function genNode(node, context){

    switch (node.type) {
        case NodeTypes.TEXT:
            // text
            genText(node, context)
            break;
        case NodeTypes.INTERPOLATION:
            genInterpolation(node, context)
            break;
        case NodeTypes.SIMPLE_EXPRESSION:
            genExpression(node, context)
            break;
        default:
            break;
    }
}

function genExpression(node, context){
    const { push } = context

    push(`${node.content}`)
}

function genInterpolation(node, context){
    const { push, helper } = context
    console.log(node)
    push(`${helper(TO_DISPLAY_STRING)}(`)
    genNode(node.content, context)
    push(`)`)
}

function genText(node: any, context: any) {
    const { push } = context
    push(`'${node.content}'`)
}