"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Phone, ArrowLeft, Search, MapPin, Clock, AlertTriangle, Shield, Heart, Truck, Building } from "lucide-react"
import Link from "next/link"

interface EmergencyContact {
  id: string
  name: string
  department: string
  phone: string
  location: string
  availability: "24/7" | "business-hours" | "on-call"
  category: "medical" | "security" | "fire" | "transport" | "admin"
  priority: "high" | "medium" | "low"
}

export default function EmergencyContactsPage() {
  const [userRole, setUserRole] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    if (!role) {
      router.push("/login")
    } else {
      setUserRole(role)
    }
  }, [router])

  const contacts: EmergencyContact[] = [
    {
      id: "1",
      name: "Emergency Medical Services",
      department: "Army Medical Corps",
      phone: "+91-9876543210",
      location: "Base Hospital, Sector A",
      availability: "24/7",
      category: "medical",
      priority: "high",
    },
    {
      id: "2",
      name: "Security Control Room",
      department: "Military Police",
      phone: "+91-9876543211",
      location: "Main Gate Security",
      availability: "24/7",
      category: "security",
      priority: "high",
    },
    {
      id: "3",
      name: "Fire Emergency",
      department: "Fire Safety Division",
      phone: "+91-9876543212",
      location: "Fire Station, Central Block",
      availability: "24/7",
      category: "fire",
      priority: "high",
    },
    {
      id: "4",
      name: "Transport Emergency",
      department: "Army Service Corps",
      phone: "+91-9876543213",
      location: "Transport Pool",
      availability: "on-call",
      category: "transport",
      priority: "medium",
    },
    {
      id: "5",
      name: "Commanding Officer",
      department: "Administration",
      phone: "+91-9876543214",
      location: "Command Office",
      availability: "business-hours",
      category: "admin",
      priority: "high",
    },
    {
      id: "6",
      name: "Welfare Officer",
      department: "Personnel Division",
      phone: "+91-9876543215",
      location: "Welfare Office, Block B",
      availability: "business-hours",
      category: "admin",
      priority: "medium",
    },
  ]

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "medical":
        return <Heart className="w-5 h-5 text-red-500" />
      case "security":
        return <Shield className="w-5 h-5 text-blue-500" />
      case "fire":
        return <AlertTriangle className="w-5 h-5 text-orange-500" />
      case "transport":
        return <Truck className="w-5 h-5 text-green-500" />
      case "admin":
        return <Building className="w-5 h-5 text-purple-500" />
      default:
        return <Phone className="w-5 h-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "24/7":
        return "bg-green-100 text-green-800"
      case "business-hours":
        return "bg-blue-100 text-blue-800"
      case "on-call":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sort by priority (high first) and then by category
  const sortedContacts = filteredContacts.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }
    return a.category.localeCompare(b.category)
  })

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
              <h1 className="text-xl font-bold text-gray-900">Emergency Contacts</h1>
            </div>
            {userRole === "admin" && <Button className="bg-red-600 hover:bg-red-700">Add Contact</Button>}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Emergency Banner */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">Emergency Protocol</h3>
              <p className="text-red-700 text-sm">
                In case of immediate emergency, dial the appropriate number below. For life-threatening situations,
                contact Medical Emergency Services first.
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search emergency contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedContacts.map((contact) => (
            <Card key={contact.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(contact.category)}
                    <div>
                      <CardTitle className="text-lg">{contact.name}</CardTitle>
                      <CardDescription>{contact.department}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(contact.priority)}>{contact.priority.toUpperCase()}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="font-mono font-medium">{contact.phone}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{contact.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <Badge className={getAvailabilityColor(contact.availability)} variant="outline">
                      {contact.availability === "24/7"
                        ? "24/7 Available"
                        : contact.availability === "business-hours"
                          ? "Business Hours"
                          : "On Call"}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => window.open(`tel:${contact.phone}`)}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                  <Button size="sm" variant="outline">
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
            <p className="text-gray-600">Try adjusting your search terms.</p>
          </div>
        )}
      </main>
    </div>
  )
}
