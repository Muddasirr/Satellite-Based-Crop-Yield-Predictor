from fastapi import FastAPI
from groq import Groq
import uvicorn

api_key = "Api_Key"
client = Groq(api_key=api_key)
app = FastAPI()
 
@app.get("/chat")
def get_groq_client(question: str):
    # if not is_agriculture_question(question):
    #     return {"response": "I'm sorry, I can only answer questions related to agriculture."}

    completion = client.chat.completions.create(
        model="gemma2-9b-it",
        messages=[
            {
                'role': 'system',
                'content': 'You are a specialized agriculture chatbot who can answer any question related to agriculture.You politely refuse to answer any question that is not related to agriculture. Answer in simple manner without fancying the language.'
            },
            {'role': 'user', 'content': question}
        ],
        temperature=1,
        max_tokens=512,
        top_p=1,
        stream=False,
    )

    return {"response": completion.choices[0].message.content}

#  MAIN METHOD
if __name__ == "__main__":
    uvicorn.run("chatbot:app", host="0.0.0.0", port=8000, reload=True)
