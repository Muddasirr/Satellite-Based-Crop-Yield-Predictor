from fastapi import FastAPI
from groq import Groq
import uvicorn

api_key = "Api_Key"
client = Groq(api_key=api_key)
app = FastAPI()

# Optional: List of agriculture-related keywords to screen input
AGRICULTURE_KEYWORDS = [
    "crop", "soil", "yield", "fertilizer", "farming", "irrigation", "climate", 
    "harvest", "pesticide", "agriculture", "planting", "weather", "field", "agronomy", "tractor",
    "livestock", "animal husbandry", "sustainable agriculture", "organic farming",
    "agricultural technology", "precision agriculture", "crop rotation", "hydroponics",
    "aquaponics", "greenhouse", "agricultural economics", "food security", "agroecology",
    "agricultural policy", "agricultural research", "agricultural extension", "agricultural education",
    "agricultural engineering", "agricultural machinery", "agricultural biotechnology",
    "agricultural marketing", "agricultural finance", "agricultural trade", "agricultural sustainability",
    "agricultural development", "agricultural practices", "agricultural systems", "agricultural production",
    "agricultural management", "agricultural resources", "agricultural inputs", "agricultural outputs",
    "agricultural value chain", "agricultural innovation", "agricultural entrepreneurship",
    "agricultural cooperatives", "agricultural policy analysis", "agricultural risk management",
    "agricultural supply chain", "agricultural marketing strategies", "agricultural education programs",
    "agricultural research methods", "agricultural extension services", "agricultural sustainability practices",
    'pest', 'disease', 'irrigation', 'fertilizer', 'crop rotation', 'organic', 'sustainable',
    'agronomy', 'soil health', 'plant breeding', 'genetics', 'biotechnology', 'agroecology',
    'agricultural economics', 'food production', 'food systems', 'agricultural policy',
    'agricultural research', 'agricultural technology', 'precision farming', 'smart agriculture',
    'agricultural machinery', 'agricultural engineering', 'agricultural practices'

]

def is_agriculture_question(question: str) -> bool:
    question_lower = question.lower()
    return any(keyword in question_lower for keyword in AGRICULTURE_KEYWORDS)

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
