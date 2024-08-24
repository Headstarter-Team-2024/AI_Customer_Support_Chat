import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req) {
    const url  = await req.text()
  try{
    const browser  = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('.Comments__StyledComments-dzzyvm-0');

    const data = await page.evaluate(()=>{
        const rating = document.querySelector('.RatingValue__Numerator-qw8sqy-2').textContent
        const name = document.querySelector('.NameTitle__Name-dowf0z-0').textContent
        const would_take_again = document.querySelector('.FeedbackItem__FeedbackNumber-uof32n-1').textContent
        const difficulty = document.querySelectorAll('.FeedbackItem__FeedbackNumber-uof32n-1')[1].textContent
        const commentsContainer = document.querySelectorAll('.Comments__StyledComments-dzzyvm-0')
        const comments = Array.from(commentsContainer).map(comment=>comment.textContent.trim())
        return {rating,name,would_take_again,difficulty,comments}
    })
    const name = await page.evaluate(()=>{
       
        const name = document.querySelector('.NameTitle__Name-dowf0z-0').textContent
        // const last_name = document.querySelector('.NameTitle__LastNameWrapper-dowf0z-2').textContent
        return name
    })

    const would_take_again = await page.evaluate(()=>{
        const would_take_again = document.querySelector('.FeedbackItem__FeedbackNumber-uof32n-1').textContent
        return would_take_again
    })
    
    const difficulty = await page.evaluate(()=>{
        const difficulty = document.querySelectorAll('.FeedbackItem__FeedbackNumber-uof32n-1')[1].textContent
        return difficulty   
    })

    const comments = await page.evaluate(()=>{
        const commentsContainer = document.querySelectorAll('.Comments__StyledComments-dzzyvm-0')
        const comments = Array.from(commentsContainer).map(comment=>comment.textContent.trim())
        return comments
    })
  

    

    await browser.close()
    return NextResponse.json(data,{status: 200})
  }
  catch(error){
    return NextResponse.json({error: error.message}, {status: 400})
  }
}