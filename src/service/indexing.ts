import { OpenAIEmbeddings } from "@langchain/openai";
 import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
 
import dotenv from 'dotenv'
dotenv.config({path:"../../.env"})
export const embeddings = new OpenAIEmbeddings({
    //model: "text-embedding-3-large"
  model:"text-embedding-3-small",
  apiKey:process.env.OPEN_AI_KEY
});

 
const pinecone = new PineconeClient({
  apiKey: process.env.PINECONE_API_KEY as string,
});
const pineconeIndex = pinecone.Index("customersupport");

export const vectorStore = new PineconeStore(embeddings, {
  pineconeIndex,
  maxConcurrency: 5,
});



const pdfPath = "../asset/JSP_Tech_Academy_Brochure.pdf";

const loader = new PDFLoader(pdfPath,{
  splitPages: false,
})
async function generateEmbedding()
{
   const data=await loader.load()
//    const doc=data[0].pageContent
   const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 600,
  chunkOverlap: 200,
});
 
const allSplits = await splitter.splitDocuments(data);
 const result=await vectorStore.addDocuments(allSplits);
 console.log("**********")
 console.log(result)
}




//generateEmbedding()