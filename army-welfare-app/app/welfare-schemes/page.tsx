"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  ArrowLeft,
  Calendar,
  Users,
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageCircle,
  Send,
  UserCircle,
} from "lucide-react"
import Link from "next/link"

interface UserProfile {
  rank: string
  age: number
  gender: string
  serviceYears: number
  status: "active" | "retired" | "family"
  specialization: string
  familySize: number
  currentPosting: string
  batch: string
}

interface WelfareScheme {
  id: string
  title: string
  description: string
  category: string
  eligibility: {
    minAge?: number
    maxAge?: number
    minServiceYears?: number
    ranks?: string[]
    status?: ("active" | "retired" | "family")[]
    gender?: string[]
    specializations?: string[]
    batch?: string[]
  }
  amount: string
  deadline: string
  status: "active" | "pending" | "closed"
  applicants: number
  maxApplicants: number
}

export default function WelfareSchemesPage() {
  const [userRole, setUserRole] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<UserProfile>({
    rank: "Captain",
    age: 35,
    gender: "male",
    serviceYears: 10,
    status: "active",
    specialization: "Infantry",
    familySize: 4,
    currentPosting: "Northern Command",
    batch: "2013",
  })

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    if (!role) {
      router.push("/login")
    } else {
      setUserRole(role)
      // In a real app, fetch user profile from API
      // fetchUserProfile()
    }
  }, [router])

  const [chatMessages, setChatMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm your AI Welfare Assistant. I can help you find the most suitable welfare schemes based on your profile. What would you like to know?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const quickQuestions = [
    "What schemes am I eligible for?",
    "Education schemes for my children",
    "Medical emergency support",
    "Housing loan assistance",
    "Retirement benefits",
  ]

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return

    const userMessage = {
      sender: "user",
      text: chatInput,
      timestamp: new Date().toLocaleTimeString(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsTyping(true)

    try {
      console.log('Sending chat request with:', {
        message: chatInput,
        userProfile,
        eligibleSchemesCount: getEligibleSchemes().length
      })

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: chatInput,
          userProfile,
          eligibleSchemes: getEligibleSchemes(),
        }),
      })

      const data = await response.json()
      console.log('Received response:', data)

      if (!response.ok) {
        const errorMessage = data.error || data.details || "Failed to get AI response"
        console.error('Chat API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage,
          details: data.details,
          apiKeyInfo: data.apiKeyPresent !== undefined ? {
            present: data.apiKeyPresent,
            length: data.apiKeyLength
          } : undefined
        })
        throw new Error(errorMessage)
      }

      if (!data.response) {
        console.error('Invalid response format:', data)
        throw new Error("Invalid response format from server")
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.response,
          timestamp: new Date().toLocaleTimeString(),
        },
      ])
    } catch (error) {
      console.error("Error getting AI response:", error)
      
      let errorMessage = "I apologize, but I'm having trouble processing your request right now."
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = "The AI service is not properly configured. Please contact the administrator to set up the OpenAI API key."
        } else {
          errorMessage = `I apologize, but I encountered an error: ${error.message}. Please try again later.`
        }
      }
      
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: errorMessage,
          timestamp: new Date().toLocaleTimeString(),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickQuestion = (question: string) => {
    setChatInput(question)
    handleSendMessage()
  }

  const checkEligibility = (scheme: WelfareScheme) => {
    const { eligibility } = scheme

    // Check age requirements
    const ageEligible =
      (!eligibility.minAge || userProfile.age >= eligibility.minAge) &&
      (!eligibility.maxAge || userProfile.age <= eligibility.maxAge)

    // Check service years
    const serviceYearsEligible =
      !eligibility.minServiceYears || userProfile.serviceYears >= eligibility.minServiceYears

    // Check rank
    const rankEligible = !eligibility.ranks || 
      (Array.isArray(eligibility.ranks) && eligibility.ranks.includes(userProfile.rank))

    // Check status
    const statusEligible = !eligibility.status || 
      (Array.isArray(eligibility.status) && eligibility.status.includes(userProfile.status))

    // Check gender
    const genderEligible = !eligibility.gender || 
      (Array.isArray(eligibility.gender) && eligibility.gender.includes(userProfile.gender))

    // Check specialization
    const specializationEligible = !eligibility.specializations || 
      (Array.isArray(eligibility.specializations) && eligibility.specializations.includes(userProfile.specialization))

    // Check batch
    const batchEligible = !eligibility.batch || 
      (Array.isArray(eligibility.batch) && eligibility.batch.includes(userProfile.batch))

    return (
      ageEligible &&
      serviceYearsEligible &&
      rankEligible &&
      statusEligible &&
      genderEligible &&
      specializationEligible &&
      batchEligible
    )
  }

  const getEligibleSchemes = () => {
    return schemes.filter(checkEligibility)
  }

  const getEligibilityDetails = (scheme: WelfareScheme) => {
    const details = []
    const { eligibility } = scheme

    if (eligibility.minAge) {
      details.push(`Min Age: ${eligibility.minAge} years`)
    }
    if (eligibility.maxAge) {
      details.push(`Max Age: ${eligibility.maxAge} years`)
    }
    if (eligibility.minServiceYears) {
      details.push(`Min Service: ${eligibility.minServiceYears} years`)
    }
    if (Array.isArray(eligibility.specializations) && eligibility.specializations.length > 0) {
      details.push(`Specializations: ${eligibility.specializations.join(", ")}`)
    }
    if (Array.isArray(eligibility.gender) && eligibility.gender.length > 0) {
      details.push(`Gender: ${eligibility.gender.map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(", ")}`)
    }
    if (Array.isArray(eligibility.status) && eligibility.status.length > 0) {
      details.push(`Status: ${eligibility.status.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(", ")}`)
    }

    return details
  }

  const schemes: WelfareScheme[] = [
    {
      id: "1",
      title: "Education Support Grant",
      description: "Financial assistance for children's education including tuition fees, books, and supplies.",
      category: "education",
      eligibility: {
        minServiceYears: 5,
        ranks: ["Captain", "Major", "Colonel", "Lieutenant"],
        status: ["active", "retired"],
        specializations: ["Infantry", "Artillery", "Engineers"],
      },
      amount: "₹50,000",
      deadline: "2024-03-15",
      status: "active",
      applicants: 45,
      maxApplicants: 100,
    },
    {
      id: "2",
      title: "Medical Emergency Fund",
      description: "Emergency financial support for critical medical treatments and surgeries.",
      category: "medical",
      eligibility: {
        ranks: ["Captain", "Major", "Colonel", "Lieutenant", "Sergeant", "Corporal"],
        status: ["active", "retired", "family"],
      },
      amount: "₹2,00,000",
      deadline: "2024-02-28",
      status: "active",
      applicants: 23,
      maxApplicants: 50,
    },
    {
      id: "3",
      title: "Housing Loan Subsidy",
      description: "Interest subsidy on home loans for army personnel and their families.",
      category: "housing",
      eligibility: {
        minServiceYears: 8,
        ranks: ["Major", "Colonel", "Lieutenant Colonel"],
        status: ["active"],
        specializations: ["Infantry", "Artillery", "Engineers", "Signals"],
      },
      amount: "₹5,00,000",
      deadline: "2024-04-30",
      status: "active",
      applicants: 78,
      maxApplicants: 200,
    },
    {
      id: "4",
      title: "Skill Development Program",
      description: "Training and certification programs for career advancement and skill building.",
      category: "training",
      eligibility: {
        maxAge: 45,
        ranks: ["Captain", "Major", "Lieutenant", "Sergeant", "Corporal"],
        status: ["active"],
        specializations: ["Infantry", "Artillery", "Engineers", "Signals", "Medical"],
      },
      amount: "₹25,000",
      deadline: "2024-01-31",
      status: "closed",
      applicants: 120,
      maxApplicants: 120,
    },
    {
      id: "5",
      title: "Family Welfare Support",
      description: "Monthly allowance for families facing financial hardships.",
      category: "family",
      eligibility: {
        status: ["family"],
        gender: ["female"],
      },
      amount: "₹15,000/month",
      deadline: "2024-03-31",
      status: "pending",
      applicants: 12,
      maxApplicants: 75,
    },
    {
      id: "6",
      title: "Retirement Transition Grant",
      description: "Financial support for personnel transitioning to civilian life after retirement.",
      category: "retirement",
      eligibility: {
        minServiceYears: 15,
        status: ["retired"],
        ranks: ["Major", "Colonel", "Lieutenant Colonel", "Sergeant Major"],
      },
      amount: "₹3,00,000",
      deadline: "2024-05-30",
      status: "active",
      applicants: 34,
      maxApplicants: 150,
    },
    {
      id: "7",
      title: "Special Forces Training Fund",
      description: "Advanced training support for special forces personnel.",
      category: "training",
      eligibility: {
        maxAge: 35,
        minServiceYears: 3,
        status: ["active"],
        specializations: ["Special Forces", "Para Commandos"],
        ranks: ["Captain", "Major", "Lieutenant"],
      },
      amount: "₹1,00,000",
      deadline: "2024-06-15",
      status: "active",
      applicants: 15,
      maxApplicants: 50,
    },
  ]

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "education", label: "Education" },
    { value: "medical", label: "Medical" },
    { value: "housing", label: "Housing" },
    { value: "training", label: "Training" },
    { value: "family", label: "Family Welfare" },
  ]

  const statuses = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "closed", label: "Closed" },
  ]

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch =
      scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || scheme.category === categoryFilter
    const matchesStatus = statusFilter === "all" || scheme.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "closed":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!userRole) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Welfare Schemes</h1>
            </div>
            {userRole === "admin" && <Button className="bg-green-600 hover:bg-green-700">Add New Scheme</Button>}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="w-5 h-5" />
                Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Rank:</span>
                <span className="text-sm">{userProfile.rank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Age:</span>
                <span className="text-sm">{userProfile.age} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Service:</span>
                <span className="text-sm">{userProfile.serviceYears} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Status:</span>
                <span className="text-sm capitalize">{userProfile.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Specialization:</span>
                <span className="text-sm">{userProfile.specialization}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Current Posting:</span>
                <span className="text-sm">{userProfile.currentPosting}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Batch:</span>
                <span className="text-sm">{userProfile.batch}</span>
              </div>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>AI Welfare Assistant</CardTitle>
              <CardDescription>Ask about welfare schemes you're eligible for</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
                <div className="h-[400px] overflow-y-auto border rounded-lg p-4 space-y-4">
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <p className="text-sm">Typing...</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schemes List */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Available Welfare Schemes</CardTitle>
                <CardDescription>
                  Browse and filter available welfare schemes. Highlighted schemes are ones you're eligible for.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="mb-8 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search schemes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Schemes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSchemes.map((scheme) => {
                    const isEligible = checkEligibility(scheme)
                    const eligibilityDetails = getEligibilityDetails(scheme)
                    
                    return (
                      <Card 
                        key={scheme.id} 
                        className={`hover:shadow-lg transition-shadow ${
                          isEligible ? "border-green-200 bg-green-50" : ""
                        }`}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg line-clamp-2">{scheme.title}</CardTitle>
                              {isEligible && (
                                <Badge className="mt-1 bg-green-100 text-green-800">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Eligible
                                </Badge>
                              )}
                            </div>
                            <Badge className={getStatusColor(scheme.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(scheme.status)}
                                {scheme.status.charAt(0).toUpperCase() + scheme.status.slice(1)}
                              </div>
                            </Badge>
                          </div>
                          <CardDescription className="line-clamp-3">{scheme.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-medium">{scheme.amount}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Deadline: {new Date(scheme.deadline).toLocaleDateString()}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>
                              {scheme.applicants}/{scheme.maxApplicants} applicants
                            </span>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">Eligibility Criteria:</p>
                            <div className="space-y-1">
                              {eligibilityDetails.map((detail, index) => (
                                <div key={index} className="text-xs text-gray-600 flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full bg-gray-300" />
                                  {detail}
                                </div>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {scheme.eligibility.ranks && scheme.eligibility.ranks.map((rank, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {rank}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button size="sm" className="flex-1">
                              <FileText className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            {scheme.status === "active" && isEligible && (
                              <Button size="sm" variant="outline" className="flex-1 bg-green-100 hover:bg-green-200 text-green-800 border-green-200">
                                Apply Now
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {filteredSchemes.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No schemes found</h3>
                    <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
