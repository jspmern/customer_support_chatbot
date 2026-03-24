 import { modal } from "./modal/llm.ts"
 import { ToolNode } from "@langchain/langgraph/prebuilt"
 import { StateGraph, Annotation, END } from "@langchain/langgraph";
import { StateAnnotation } from "./state/state.ts";
import { CATEGORIZATION_HUMAN_PROMPT, CATEGORIZATION_SYSTEM_PROMPT, SYSTEM_PROMPT } from "./prompt/prompt.ts";
import { getOffer } from "./tools/marketingTools.ts";
import { AIMessage } from "@langchain/core/messages";

//marketing tools
const marketingTool=[getOffer]
const marketingToolNode=new ToolNode(marketingTool)

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
  const marketingSystemPrompt=`You are part of the Marketing Team at Coder's Gyan, an ed-tech company that helps software developers excel in their careers through practical web development and Generative AI courses.
You specialize in handling questions about promo codes, discounts, offers, and special campaigns.
Answer clearly, concisely, and in a friendly manner. For queries outside promotions (course content, learning), politely redirect the student to the correct team.
Important: Answer only using given context, else say I don't have enough information about it.`;
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
    console.log("hi i am learning agent")
    console.log('state.messages',state)
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
 const graph=new StateGraph(StateAnnotation)
 .addNode("frontendDesk",frontendDeskAgent)
 .addNode("marketing",marketingAgent)
 .addNode("learning",learningAgent)
 .addNode('marketingToolNode',marketingToolNode)
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
 .addEdge("marketingToolNode","marketing")
 //Todo :--- later we have to change as per the requirment  
 .addEdge("learning","__end__")

 const app=graph.compile()
 async function main(){
 const stream=await app.stream({
    messages:[
        {
            role:"user",
            content:"do i have any offer in nodejs project"
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