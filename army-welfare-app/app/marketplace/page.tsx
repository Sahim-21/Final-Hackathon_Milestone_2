"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Package,
  ArrowLeft,
  Search,
  Plus,
  User,
  Calendar,
  MapPin,
  Heart,
  MessageCircle,
  Upload,
  BookOpen,
  Wrench,
  Home,
} from "lucide-react"
import Link from "next/link"

interface Resource {
  id: string
  title: string
  description: string
  category: "books" | "equipment" | "housing"
  type: "offer" | "request"
  owner: string
  location: string
  datePosted: string
  status: "available" | "pending" | "completed"
  image?: string
  price?: string
}

export default function MarketplacePage() {
  const [userRole, setUserRole] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false)
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
  const [newResource, setNewResource] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    price: "",
    type: "offer" as "offer" | "request",
  })
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    if (!role) {
      router.push("/login")
    } else {
      setUserRole(role)
    }
  }, [router])

  const resources: Resource[] = [
    {
      id: "1",
      title: "Military Strategy Textbooks Set",
      description:
        "Complete collection of military strategy and tactics books including Sun Tzu's Art of War, Clausewitz, and modern warfare tactics. Excellent condition.",
      category: "books",
      type: "offer",
      owner: "Col. Sharma",
      location: "Officers Mess, Block A",
      datePosted: "2024-01-15",
      status: "available",
      image: "/placeholder.svg?height=200&width=300",
      price: "₹2,500",
    },
    {
      id: "2",
      title: "Need: Engineering Reference Books",
      description:
        "Looking for civil engineering reference books for competitive exams. Willing to pay good price for recent editions.",
      category: "books",
      type: "request",
      owner: "Maj. Patel",
      location: "Family Quarters, Sector C",
      datePosted: "2024-01-14",
      status: "available",
    },
    {
      id: "3",
      title: "Professional Camping Equipment",
      description:
        "High-quality camping gear including 4-person tent, sleeping bags, portable stove, and hiking backpacks. Perfect for training exercises.",
      category: "equipment",
      type: "offer",
      owner: "Capt. Singh",
      location: "Training Wing",
      datePosted: "2024-01-13",
      status: "pending",
      image: "/placeholder.svg?height=200&width=300",
      price: "₹15,000",
    },
    {
      id: "4",
      title: "2BHK Apartment for Rent",
      description:
        "Well-furnished 2BHK apartment near the base. Suitable for officers with family. All amenities included.",
      category: "housing",
      type: "offer",
      owner: "Lt. Col. Gupta",
      location: "Civilian Area, 2km from base",
      datePosted: "2024-01-12",
      status: "available",
      image: "/placeholder.svg?height=200&width=300",
      price: "₹25,000/month",
    },
    {
      id: "5",
      title: "Need: Temporary Accommodation",
      description:
        "Looking for temporary accommodation for 2 weeks during transfer period. Single officer, non-smoker.",
      category: "housing",
      type: "request",
      owner: "Lt. Kumar",
      location: "Any location within 5km of base",
      datePosted: "2024-01-11",
      status: "available",
    },
    {
      id: "6",
      title: "Technical Equipment Set",
      description:
        "Electronics testing equipment, multimeters, oscilloscope, and various tools. Great for technical training.",
      category: "equipment",
      type: "offer",
      owner: "Maj. Reddy",
      location: "Technical Wing",
      datePosted: "2024-01-10",
      status: "available",
      image: "/placeholder.svg?height=200&width=300",
      price: "₹8,500",
    },
  ]

  const categories = [
    { value: "books", label: "Books", icon: BookOpen },
    { value: "equipment", label: "Equipment", icon: Wrench },
    { value: "housing", label: "Housing", icon: Home },
  ]

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find((cat) => cat.value === category)
    return categoryData ? <categoryData.icon className="w-5 h-5" /> : <Package className="w-5 h-5" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    return type === "offer" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
  }

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase())

    let matchesTab = false
    if (activeTab === "all") {
      matchesTab = true
    } else if (activeTab === "offers") {
      matchesTab = resource.type === "offer"
    } else if (activeTab === "requests") {
      matchesTab = resource.type === "request"
    } else if (activeTab === "my-items") {
      matchesTab = resource.owner.includes("Singh") // Mock user filter
    } else {
      matchesTab = resource.category === activeTab
    }

    return matchesSearch && matchesTab
  })

  const handleSubmitResource = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitting resource:", newResource)
    setIsOfferDialogOpen(false)
    setIsRequestDialogOpen(false)
    setNewResource({ title: "", description: "", category: "", location: "", price: "", type: "offer" })
  }

  const handleStartConversation = (resourceOwner: string, resourceTitle: string) => {
    alert(`Starting conversation with ${resourceOwner} about "${resourceTitle}"`)
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
              <h1 className="text-xl font-bold text-gray-900">Resource Marketplace</h1>
            </div>
            <div className="flex gap-2">
              <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                    <Plus className="w-4 h-4 mr-2" />
                    Request Resource
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Request a Resource</DialogTitle>
                    <DialogDescription>
                      Describe what you're looking for and other members can help you find it.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmitResource} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="request-title">What are you looking for?</Label>
                      <Input
                        id="request-title"
                        placeholder="e.g., Books regarding army regulations"
                        value={newResource.title}
                        onChange={(e) =>
                          setNewResource((prev) => ({ ...prev, title: e.target.value, type: "request" }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="request-category">Category</Label>
                      <Select
                        value={newResource.category}
                        onValueChange={(value) => setNewResource((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              <div className="flex items-center gap-2">
                                <category.icon className="w-4 h-4" />
                                {category.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="request-description">Description</Label>
                      <Textarea
                        id="request-description"
                        placeholder="Provide details about what you need..."
                        value={newResource.description}
                        onChange={(e) => setNewResource((prev) => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="request-location">Your Location</Label>
                      <Input
                        id="request-location"
                        placeholder="e.g., Officers Mess, Block A"
                        value={newResource.location}
                        onChange={(e) => setNewResource((prev) => ({ ...prev, location: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                        Post Request
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsRequestDialogOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Post Resource
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Post a Resource</DialogTitle>
                    <DialogDescription>
                      Share a resource with other army personnel. Include all relevant details.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmitResource} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="offer-title">Title</Label>
                      <Input
                        id="offer-title"
                        placeholder="Brief title for your resource"
                        value={newResource.title}
                        onChange={(e) => setNewResource((prev) => ({ ...prev, title: e.target.value, type: "offer" }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="offer-category">Category</Label>
                      <Select
                        value={newResource.category}
                        onValueChange={(value) => setNewResource((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              <div className="flex items-center gap-2">
                                <category.icon className="w-4 h-4" />
                                {category.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="offer-description">Description</Label>
                      <Textarea
                        id="offer-description"
                        placeholder="Detailed description of the resource..."
                        value={newResource.description}
                        onChange={(e) => setNewResource((prev) => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="offer-location">Location</Label>
                      <Input
                        id="offer-location"
                        placeholder="Where can it be collected?"
                        value={newResource.location}
                        onChange={(e) => setNewResource((prev) => ({ ...prev, location: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="offer-price">Price (Optional)</Label>
                      <Input
                        id="offer-price"
                        placeholder="e.g., ₹500 or Free"
                        value={newResource.price}
                        onChange={(e) => setNewResource((prev) => ({ ...prev, price: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="offer-image">Upload Image</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                        Post Resource
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsOfferDialogOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="books">
              <BookOpen className="w-4 h-4 mr-1" />
              Books
            </TabsTrigger>
            <TabsTrigger value="equipment">
              <Wrench className="w-4 h-4 mr-1" />
              Equipment
            </TabsTrigger>
            <TabsTrigger value="housing">
              <Home className="w-4 h-4 mr-1" />
              Housing
            </TabsTrigger>
            <TabsTrigger value="offers">Offers</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              {resource.image && (
                <div className="h-48 bg-gray-200">
                  <img
                    src={resource.image || "/placeholder.svg"}
                    alt={resource.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
                  <div className="flex flex-col gap-1">
                    <Badge className={getTypeColor(resource.type)}>
                      {resource.type === "offer" ? "Offering" : "Requesting"}
                    </Badge>
                    <Badge className={getStatusColor(resource.status)} variant="outline">
                      {resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="line-clamp-3">{resource.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(resource.category)}
                    <span className="capitalize">{resource.category}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{resource.owner}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{resource.location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Posted {new Date(resource.datePosted).toLocaleDateString()}</span>
                  </div>

                  {resource.price && (
                    <div className="flex items-center gap-2 font-semibold text-green-600">
                      <span>💰</span>
                      <span>{resource.price}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleStartConversation(resource.owner, resource.title)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button size="sm" variant="outline">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600">Try adjusting your search terms or check different categories.</p>
          </div>
        )}
      </main>
    </div>
  )
}
