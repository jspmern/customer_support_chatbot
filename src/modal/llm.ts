import { ChatGroq } from "@langchain/groq"
import dotenv from "dotenv"

dotenv.config()
export const modal= new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
    maxRetries: 2,
})
