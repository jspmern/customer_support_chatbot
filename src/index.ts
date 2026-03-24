 import { modal } from "./modal/llm.ts"
 import { StateGraph, Annotation } from "@langchain/langgraph";
import { StateAnnotation } from "./state/state.ts";
import { CATEGORIZATION_HUMAN_PROMPT, CATEGORIZATION_SYSTEM_PROMPT, SYSTEM_PROMPT } from "./prompt/prompt.ts";

async function frontendDeskAgent(state:typeof StateAnnotation.State)
{
    console.log('state.messages',state)

   const supportResponse= await  modal.invoke([
        {
            role:"system",
            content:SYSTEM_PROMPT
        },
        ...state.messages
     ])

    const categorizationResponse= await modal.invoke([
        {
            role:"system",
            content:CATEGORIZATION_SYSTEM_PROMPT
        },
        ...state.messages,
        supportResponse,
        {
            role:"user",
            content:CATEGORIZATION_HUMAN_PROMPT
        },
    ],{
        response_format:{type:"json_object"}
    })
      const categorizationOutput = JSON.parse(categorizationResponse.content as string);
      console.log("categorizationOutput",{
        messages: [supportResponse],
        nextRepresentative: categorizationOutput.nextRepresentative,
    })

    return {
        messages: [supportResponse],
        nextRepresentative: categorizationOutput.nextRepresentative,
    };  
}

async function marketingAgent(state:typeof StateAnnotation.State)
{
    console.log("Asking the model...")
    return state
}
async function learningAgent(state:typeof StateAnnotation.State)
{
    console.log("Asking the model...")
    return state
}
async function whereToGoNext(state:typeof StateAnnotation.State){
    
}
 const graph=new StateGraph(StateAnnotation)
 .addNode("frontendDesk",frontendDeskAgent)
 .addConditionalEdges("frontendDesk",whereToGoNext,{})
//  .addNode("marketing",marketingAgent)
//  .addNode("learning",learningAgent)
 .addEdge("__start__","frontendDesk")
 .addEdge("frontendDesk","__end__")

 const app=graph.compile()
 async function main(){
 const stream=await app.stream({
    messages:[
        {
            role:"user",
            content:"i want to learn nodejs"
        }
    ]
 })

    for await (const message of stream)
    {
        console.log("----------------start------------------")
        console.log(message)
        console.log("----------------end------------------")
    }
 }
 main()