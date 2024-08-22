from dotenv import load_dotenv
import os
load_dotenv('.env.local')
from openai import OpenAI
from pinecone import Pinecone
import json

load_dotenv('.env.local')

pc = Pinecone(api_key=os.getenv('PINE_CONE_KEY'))
data = []
#for proper encoding. Previously the apostrophe ' was not being encoded correctly
with open('reviews.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

combined_input = ''
for professor in data:
    
    combined_input += (
        f"\n"
        f"Profesor Name: {professor['name']}\n"
        f"Department: {professor['department']}\n"
        f"Overall Rating: {professor['Overall Rating']}\n"
        f"Courses: {professor['Courses']}\n"
    )

processed_data = []
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


for professor in data:
    ratings = ''
    for rating in professor["Ratings"]:
        ratings += f"Course: {rating['course']} Rating: {rating['rating']}, Comment: {rating['message']}\n"
    response = client.embeddings.create(
        input = combined_input,
        model = "text-embedding-3-small"
    )
    embedding = response.data[0].embedding
    processed_data.append({
        'id': professor['name'],
        'values': embedding,
        #used for filtering and searching
        'metadata': {
            'name': professor['name'],
            'department': professor['department'],
            'overall_rating': professor['Overall Rating'],
            'courses': professor['Courses'],
            'reviews': ratings

        }
    })

index = pc.Index('rate-my-prof')
index.upsert(
    vectors=processed_data,
    namespace = 'mock3'
)