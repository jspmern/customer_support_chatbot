 import { modal } from "./modal/llm.ts"
 import { ToolNode } from "@langchain/langgraph/prebuilt"
 import { StateGraph, Annotation, END } from "@langchain/langgraph";
import { StateAnnotation } from "./state/state.ts";
import { CATEGORIZATION_HUMAN_PROMPT, CATEGORIZATION_SYSTEM_PROMPT, learningSystemPrompt, marketingSystemPrompt, SYSTEM_PROMPT } from "./prompt/prompt.ts";
import { getOffer } from "./tools/marketingTools.ts";
import { AIMessage } from "@langchain/core/messages";
import { retrieve_lerning_tool } from "./tools/learningTools.ts";

//marketing tools
const marketingTool=[getOffer]
const marketingToolNode=new ToolNode(marketingTool)

//learning tools
const learningTool=[retrieve_lerning_tool]
const learningToolNode=new ToolNode(learningTool)

async function frontendDeskAgent(state:typeof StateAnnotation.State)
{
    //console.log('state.messages',state)

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
    return {
        messages: [supportResponse],
        nextRepresentative: categorizationOutput.nextRepresentative,
    };  
}

async function marketingAgent(state:typeof StateAnnotation.State)
{
    //console.log("hi i am marketing agentstate", state)
  const llmInvoke=  modal.bindTools(marketingTool)
  
 let trimmedHistory = state.messages;

    if (trimmedHistory.at(-1)?.getType() === 'ai') {
        trimmedHistory = trimmedHistory.slice(0, -1); // [1, 2, 3] -> [1, 2]
    }
const marketingResponse=await llmInvoke.invoke([
    {
        role:"system",
        content:marketingSystemPrompt
    },
    ...trimmedHistory
])
//console.log("hii i am marketingAgentResponse",marketingResponse)
    return {
        messages:[marketingResponse]
    }
}
async function learningAgent(state:typeof StateAnnotation.State)
{
   
 const llmInvoke=  modal.bindTools(learningTool)
 
 let trimmedHistory = state.messages;
 
    if (trimmedHistory.at(-1)?.getType() === 'ai') {
        trimmedHistory = trimmedHistory.slice(0, -1); // [1, 2, 3] -> [1, 2]
    }
  
 const learningResponse=await llmInvoke.invoke([
    {
        role:"system",
        content:learningSystemPrompt
    },
    ...trimmedHistory
])
//console.log("hii i am learningAgentResponse",learningResponse)
    return {
        messages:[learningResponse]
    }


    return state
}
async function whereToGoNext(state:typeof StateAnnotation.State){
     if(state.nextRepresentative==="MARKETING")
     {
        return "marketing"
     }
     else if(state.nextRepresentative==="LEARNING")
        { 
            return "learning"
        }
     else if (state.nextRepresentative==="RESPOND")
        {
            return "__end__"
        }
        else{
            return "__end__"
        }
}
async function whereToGoNextInMarketing(state:typeof StateAnnotation.State)
{
    //console.log("******************",state)
     const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
       if(lastMessage.tool_calls?.length)
       {
        return "marketingToolNode"
       }
        return "__end__"     
}

async function whereToGoNextInLearning(state:typeof StateAnnotation.State)
{
     //console.log("******************",state)
     const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
       if(lastMessage.tool_calls?.length)
       {
        return "learningToolNode"
       }
        return "__end__" 
}
 const graph=new StateGraph(StateAnnotation)
 .addNode("frontendDesk",frontendDeskAgent)
 .addNode("marketing",marketingAgent)
 .addNode("learning",learningAgent)
 .addNode('marketingToolNode',marketingToolNode)
 .addNode('learningToolNode',learningToolNode)
 .addEdge("__start__","frontendDesk")
  .addConditionalEdges("frontendDesk",whereToGoNext,{
    "marketing":"marketing",
    "learning":"learning",
    "__end__":"__end__"
 })
 .addConditionalEdges("marketing",whereToGoNextInMarketing,{
   marketingToolNode:"marketingToolNode",
   __end__:END
 })
 .addConditionalEdges("learning",whereToGoNextInLearning,{
   learningToolNode:"learningToolNode",
   __end__:END
 })
 .addEdge("marketingToolNode","marketing")
 //Todo :--- later we have to change as per the requirment  
 .addEdge("learningToolNode","learning")

 const app=graph.compile()
 async function main(){
 const stream=await app.stream({
    messages:[
        {
            role:"user",
            content:"do we have course on rust"
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