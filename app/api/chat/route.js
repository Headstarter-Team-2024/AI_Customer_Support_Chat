import OpenAI from "openai"
import { SystemPrompt } from "@/app/SystemPrompt"
import { NextResponse } from "next/server"
import { Pinecone } from '@pinecone-database/pinecone'

const pinecone = new Pinecone({ apiKey: process.env.PINE_CONE_KEY });

const openai = new OpenAI({  apiKey: process.env.OPENAI_API_KEY});








 export async function POST(req){

   
    //find pinecone index
   try{ 

   const index = pinecone.index("rate-my-prof").namespace('mock2')
   //create embeddings
   const data = await req.json();
   const latest_message = data[data.length - 1]['content'] 
   const embedding = await openai.embeddings.create({
    model:'text-embedding-3-small',
    input: latest_message,
    encoding_format:'float'
   })
   //find best matches
   const results = await index.query({
    topK:5,
    includeMetadata:true,
    vector:embedding.data[0].embedding
   })
   //format results into string
   let resultString = '\n\nRetrurned results from vector db (done automtically): '
   results.matches.forEach((match)=>{
    resultString+=`
    \n
        Professor:${match.id}
        Department: ${match.metadata.department}
        Courses: ${match.metadata.courses}
        Rating: ${match.metadata.overall_rating}
        Reviews:${match.metadata.reviews}
        \n\n
    `
   })
    //grab data
    const latest_message_with_matches = latest_message+ resultString
    const relevant_chat_history = data.length > 5 ? data.slice(data.length - 5) : data
   const response = await openai.chat.completions.create({
        messages:[
            {role: 'system', content: SystemPrompt},
            ...relevant_chat_history,
            {role: 'user', content: latest_message_with_matches}
        ],
        model: "gpt-4o-mini",
        stream:true


   })
   const stream = new ReadableStream({
    async start(controller) {
        //encode the response into binary
        const encoder = new TextEncoder();
        try{
            for await (const chunk of response){
                //grab chunks and encode them
                const content = chunk.choices[0]?.delta?.content
                if(content){
                    const text = encoder.encode(content)
                    controller.enqueue(text)
                }
            }
        }
        catch(error){
            console.error(error.message)
            controller.error(error.message)
        }
        finally{
            controller.close()
        }
    }
   })


   return new NextResponse(stream)
}
catch(error){
    console.error(error.message)
    return NextResponse.error(error.message,{status:400})

 }
}
