# Customer Support Chatbot

A sophisticated AI-powered customer support chatbot built with TypeScript, LangChain, and LangGraph for an ed-tech company specializing in web development and Generative AI courses.

## 🚀 Features

- **Multi-Agent Architecture**: Intelligent routing between marketing, learning, and general support agents
- **Vector Search**: Semantic search through course materials using Pinecone vector database
- **Tool Integration**: Specialized tools for marketing offers and learning content retrieval
- **PDF Processing**: Automatic ingestion and chunking of course brochures
- **State Management**: Robust conversation state handling with LangGraph
- **Multiple LLM Support**: Integration with GROQ and OpenAI models

## 🏗️ Architecture

The chatbot uses a sophisticated agent-based architecture with the following components:

### Agents
- **Frontend Desk Agent**: Initial query analysis and routing
- **Marketing Agent**: Handles pricing, offers, and promotional queries
- **Learning Agent**: Provides course information and learning support

### Tools
- **Marketing Tools**: Retrieve current offers and discount codes
- **Learning Tools**: Semantic search through course documentation

### Data Flow
1. User query → Frontend Desk Agent analyzes intent
2. Routes to appropriate specialist agent (Marketing/Learning)
3. Specialist agent uses tools to gather relevant information
4. Response generated and returned to user

## 🛠️ Technology Stack

- **Language**: TypeScript
- **AI Framework**: LangChain + LangGraph
- **LLM Providers**: GROQ, OpenAI
- **Vector Database**: Pinecone
- **Document Processing**: PDF parsing with text splitting
- **Embeddings**: OpenAI text-embedding-3-small

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- API keys for:
  - GROQ API
  - OpenAI API
  - Pinecone API

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd customer_chat_bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   GROQ_API_KEY=your_groq_api_key
   OPEN_AI_KEY=your_openai_api_key
   PINECONE_API_KEY=your_pinecone_api_key
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## 🚀 Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Data Indexing
The system includes a data indexing service that processes PDF documents and stores them in Pinecone. Run the indexing script to populate the knowledge base:

```bash
node src/service/indexing.ts
```

## 📁 Project Structure

```
customer_chat_bot/
├── src/
│   ├── index.ts                 # Main application entry point
│   ├── modal/
│   │   └── llm.ts              # LLM configuration (GROQ)
│   ├── prompt/
│   │   └── prompt.ts           # System prompts for all agents
│   ├── service/
│   │   └── indexing.ts         # PDF processing and vector storage
│   ├── state/
│   │   └── state.ts            # LangGraph state annotations
│   └── tools/
│       ├── marketingTools.ts   # Marketing-related tools
│       └── learningTools.ts    # Learning content retrieval tools
├── asset/                      # Static assets (PDFs, etc.)
├── .env                        # Environment variables
├── package.json                # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## 🔄 Workflow Explanation

### 1. Frontend Desk Agent
- Receives initial user query
- Analyzes intent using categorization prompts
- Routes to appropriate department:
  - **Marketing**: Pricing, offers, sales inquiries
  - **Learning**: Course content, tutorials, educational queries
  - **Casual**: General conversation

### 2. Specialist Agents
- **Marketing Agent**: Uses `getOffer` tool to provide discount codes
- **Learning Agent**: Uses `retrieve_learning_tool` for semantic search through course materials

### 3. Tool Integration
- Tools are bound to agents using LangChain's tool binding
- Conditional edges determine whether to call tools or end conversation
- Tool results are incorporated into agent responses

## 📊 Data Processing

### PDF Ingestion
- Loads course brochure PDF using LangChain's PDFLoader
- Splits documents into chunks (600 characters with 200 character overlap)
- Generates embeddings using OpenAI's text-embedding-3-small model
- Stores vectors in Pinecone index "customersupport"

### Vector Search
- Learning agent performs semantic search on stored vectors
- Returns relevant course information based on user queries
- Supports up to 3 retrieval attempts for optimal results

## 🎯 Supported Queries

### Marketing Queries
- "What offers do you have?"
- "Any discount codes?"
- "Pricing information"

### Learning Queries
- "Do you have courses on Rust?"
- "What's covered in the web development course?"
- "Tell me about Generative AI courses"

### General Queries
- "Hello"
- "How are you?"
- "What services do you offer?"

## 🔒 Security & Best Practices

- API keys stored in environment variables
- Input validation through LLM prompts
- Limited tool usage (max 3 retrievals for learning queries)
- Structured response formats using JSON schema

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

ISC License

## 🆘 Support

For issues or questions:
- Check the prompts in `src/prompt/prompt.ts` for current behavior
- Verify API keys in `.env` file
- Ensure Pinecone index "customersupport" exists and is populated

## 🔄 Future Enhancements

- Add more specialized agents (billing, technical support)
- Implement conversation memory across sessions
- Add multi-language support
- Integrate with CRM systems
- Add analytics and reporting features</content>
<parameter name="filePath">c:\Users\HP\Desktop\gen-ai-wrapper\customer_chat_bot\README.md