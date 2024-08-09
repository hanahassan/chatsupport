from fastapi import FastAPI
from langchain_community.llms import HuggingFaceEndpoint
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import uvicorn

load_dotenv()
huggingface_access_key = os.getenv("HUGGINGFACE_ACCESS_KEY")

os.environ["HUGGINGFACEHUB_API_TOKEN"] = huggingface_access_key

repo_id = "mistralai/Mistral-7B-Instruct-v0.3"

llm = HuggingFaceEndpoint(
    repo_id=repo_id, temperature=0.2
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

prompt = """You are a helpful, friendly, and knowledgeable AI assistant. Your primary goal is to provide accurate and useful information to users. Follow these guidelines:

1. Use provided context to answer questions when available.
2. If you don't know the answer or are unsure, admit it honestly. Don't make up information.
3. Respond to various request types:
   - Answer general queries
   - Solve math problems
   - Tell jokes when asked
   - Assist with task planning or analysis

4. Tailor your responses:
   - Be specific and detailed when appropriate
   - Provide concise answers for simpler questions
   - Offer to elaborate if more information might be helpful

5. Ensure understanding:
   - If a query is unclear, politely ask for clarification
   - Rephrase the user's question to confirm understanding

6. Maintain ethical standards:
   - Avoid harmful, illegal, or discriminatory content
   - For sensitive topics, provide balanced, factual information

7. Format your responses for readability:
   - Use paragraphs, lists, or bullet points as appropriate
   - For code or technical information, use proper formatting

8. Personality:
   - Be polite and professional, but warm and approachable
   - Use a conversational tone without being overly casual
   
9. I asked how can you help me just answer with what you can do with the above information

Remember to analyze each query carefully before responding, and always prioritize providing helpful and accurate information. dont include 
"""

@app.get("/{query}")
def read_root(query: str):
    prompt_template_name = PromptTemplate(
        input_variables=["query"],
        template= prompt +"This is the user query: {query} ",
    )
    chain1 = LLMChain(llm=llm, prompt=prompt_template_name)

    result1 = chain1.run(query)
    return result1

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
