import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { Pinecone } from '@pinecone-database/pinecone'
import OpenAI from "openai";

const openai = new OpenAI({  apiKey: process.env.OPENAI_API_KEY});
const pinecone = new Pinecone({ apiKey: process.env.PINE_CONE_KEY });



export async function POST(req) {
    const url  = await req.text()
  try{
    const browser  = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(url);
    // await page.waitForSelector('.Comments__StyledComments-dzzyvm-0');

    const data = await page.evaluate(()=>{
        const rating = document.querySelector('.RatingValue__Numerator-qw8sqy-2').textContent
        const name = document.querySelector('.NameTitle__Name-dowf0z-0').textContent
        const department = document.querySelector('.TeacherDepartment__StyledDepartmentLink-fl79e8-0').textContent
        const would_take_again = document.querySelector('.FeedbackItem__FeedbackNumber-uof32n-1').textContent
        const difficulty = document.querySelectorAll('.FeedbackItem__FeedbackNumber-uof32n-1')[1].textContent

        const coursesContainer = document.querySelectorAll('.RatingHeader__StyledClass-sc-1dlkqw1-3')
      //avoid duplicates
      const coursesSet = new Set(Array.from(coursesContainer).map(course=>course.textContent))
      // can't return a set so convert to array
      const courses = Array.from(coursesSet)

        const commentsContainer = document.querySelectorAll('.Comments__StyledComments-dzzyvm-0')
        const comments = Array.from(commentsContainer).map(comment=>comment.textContent.trim())
        return {rating,name,department,would_take_again,difficulty,courses,comments,}
    })
   
  
    
    

    await browser.close()


    // done with scraping upsert into pinecone

    // first get comment into 1 nice string
    let commentString = ''
    for (let i = 0; i < data.comments.length; i++){
        commentString+=`${data.comments[i]} \n`
    }
    //do the same for courses
    let coursesString = ''
    for(let course of data.courses){
        coursesString+=`${course} \n`
    }
    //then organie everything into a single string

    let combined_input = `
    Professor:${data.name},
    Department: ${data.department},
    Courses: ${coursesString},
    Rating: ${data.rating},
    Would take again: ${data.would_take_again},
    Difficulty: ${data.difficulty},
    Comments: ${commentString}
    `
    
    //embed the combined input
    const response = await openai.embeddings.create({
        model:'text-embedding-3-small',
        input: combined_input,
        encoding_format:'float'
    })
    const embeddings = response.data[0].embedding
    //before upserting into pinecone, we need an object with id , values (embedding) and meta data. The object gets appended to an array
    let processed_data = []
    processed_data.push({
        id: data.name,
        values: embeddings,
        metadata:{
            department: data.department,
            courses: data.courses,
            overall_rating: data.rating,
            reviews: data.comments
        }
    })
    //upsert into pinecone
    const index = pinecone.index("rate-my-prof")
    index.namespace('mock2').upsert(processed_data)

    return NextResponse.json('Successfully added to pinecone',{status: 200})
  }
  catch(error){
    return NextResponse.json({error: error.message}, {status: 400})
  }
}