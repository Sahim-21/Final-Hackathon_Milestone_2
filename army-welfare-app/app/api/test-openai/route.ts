import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Test if we can access the API
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 5
    })

    return NextResponse.json({ 
      status: "success",
      message: "OpenAI API is properly configured",
      response: response.choices[0].message
    })
  } catch (error) {
    console.error('OpenAI API Error:', error)
    return NextResponse.json(
      { 
        status: "error",
        message: "OpenAI API configuration error",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
} 