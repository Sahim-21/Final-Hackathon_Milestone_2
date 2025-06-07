import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Simple in-memory rate limiting
let lastCallTime = 0
const MIN_INTERVAL = 2000 // 2 seconds between calls

// Fallback responses for common queries
const getFallbackResponse = (message: string, userProfile: any, eligibleSchemes: any[]) => {
  const lowercaseMessage = message.toLowerCase()
  
  // Check for common questions
  if (lowercaseMessage.includes('eligible') || lowercaseMessage.includes('qualify')) {
    if (eligibleSchemes.length === 0) {
      return "Based on your current profile, I don't see any schemes you're immediately eligible for. However, eligibility criteria can change, and new schemes may become available. I recommend checking back regularly or speaking with your welfare officer for the most up-to-date information."
    }
    return `Based on your profile, you are eligible for the following schemes:\n${eligibleSchemes.map(scheme => `- ${scheme.title}: ${scheme.description}`).join('\n')}`
  }

  if (lowercaseMessage.includes('education') || lowercaseMessage.includes('study')) {
    const educationSchemes = eligibleSchemes.filter(s => s.category === 'education')
    if (educationSchemes.length > 0) {
      return `I found these education-related schemes you're eligible for:\n${educationSchemes.map(scheme => `- ${scheme.title}: ${scheme.description}`).join('\n')}`
    }
    return "I don't see any education schemes you're currently eligible for. Eligibility often depends on factors like years of service and rank. You might want to check back as your service profile changes."
  }

  if (lowercaseMessage.includes('medical') || lowercaseMessage.includes('health')) {
    const medicalSchemes = eligibleSchemes.filter(s => s.category === 'medical')
    if (medicalSchemes.length > 0) {
      return `Here are the medical welfare schemes you're eligible for:\n${medicalSchemes.map(scheme => `- ${scheme.title}: ${scheme.description}`).join('\n')}`
    }
    return "While I don't see any medical schemes you're currently eligible for, medical emergency support is a priority. Please consult your welfare officer for the most current options."
  }

  if (lowercaseMessage.includes('housing') || lowercaseMessage.includes('loan')) {
    const housingSchemes = eligibleSchemes.filter(s => s.category === 'housing')
    if (housingSchemes.length > 0) {
      return `I found these housing-related schemes you're eligible for:\n${housingSchemes.map(scheme => `- ${scheme.title}: ${scheme.description}`).join('\n')}`
    }
    return "Currently, I don't see any housing schemes matching your eligibility. Housing schemes often require a minimum service period and specific rank requirements."
  }

  if (lowercaseMessage.includes('family') || lowercaseMessage.includes('dependent')) {
    const familySchemes = eligibleSchemes.filter(s => s.category === 'family')
    if (familySchemes.length > 0) {
      return `Here are the family welfare schemes you're eligible for:\n${familySchemes.map(scheme => `- ${scheme.title}: ${scheme.description}`).join('\n')}`
    }
    return "I don't see any family welfare schemes you're currently eligible for. However, there might be special provisions available - please consult your welfare officer."
  }

  // Default response if no specific match
  return `I can help you find suitable welfare schemes based on your profile (${userProfile.rank}, ${userProfile.serviceYears} years of service). You're currently eligible for ${eligibleSchemes.length} schemes. You can ask me about specific categories like education, medical, housing, or family welfare, or ask to see all eligible schemes.`
}

export async function POST(req: Request) {
  try {
    // Rate limiting check
    const now = Date.now()
    if (now - lastCallTime < MIN_INTERVAL) {
      return NextResponse.json(
        { error: 'Please wait a moment before sending another message' },
        { status: 429 }
      )
    }
    lastCallTime = now

    // Log environment variables (safely)
    console.log('Environment check:', {
      hasApiKey: !!process.env.OPENAI_API_KEY,
      apiKeyLength: process.env.OPENAI_API_KEY?.length || 0,
      nodeEnv: process.env.NODE_ENV
    })

    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is missing')
      return NextResponse.json(
        { error: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to .env.local' },
        { status: 500 }
      )
    }

    // Parse and validate request body
    const { message, userProfile, eligibleSchemes } = await req.json()
    
    if (!message || !userProfile || !eligibleSchemes) {
      const missingFields = []
      if (!message) missingFields.push('message')
      if (!userProfile) missingFields.push('userProfile')
      if (!eligibleSchemes) missingFields.push('eligibleSchemes')
      
      console.error('Missing required fields:', missingFields)
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Try OpenAI first
    try {
      if (process.env.OPENAI_API_KEY) {
        const systemPrompt = `You are an AI Welfare Assistant helping army personnel find suitable welfare schemes. User profile: Rank ${userProfile.rank}, Age ${userProfile.age}, Service ${userProfile.serviceYears} years, Status ${userProfile.status}. Eligible schemes: ${eligibleSchemes.length > 0 ? eligibleSchemes.map(s => s.title).join(', ') : 'None'}`

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
          temperature: 0.7,
          max_tokens: 250,
        })

        if (completion.choices?.[0]?.message?.content) {
          return NextResponse.json({ 
            response: completion.choices[0].message.content,
            status: 'success'
          })
        }
      }
    } catch (openaiError: any) {
      console.error('OpenAI API Error:', {
        message: openaiError.message,
        code: openaiError.code
      })
    }

    // If OpenAI fails or is not configured, use fallback
    const fallbackResponse = getFallbackResponse(message, userProfile, eligibleSchemes)
    return NextResponse.json({ 
      response: fallbackResponse,
      status: 'success',
      source: 'fallback'
    })

  } catch (error: any) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process chat request',
        details: error.message
      },
      { status: 500 }
    )
  }
} 