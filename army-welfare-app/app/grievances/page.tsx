"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  MessageSquare,
  ArrowLeft,
  Search,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Upload,
  Sparkles,
  Filter,
} from "lucide-react"
import Link from "next/link"

interface Grievance {
  id: string
  title: string
  description: string
  category: string
  priority: "low" | "medium" | "high"
  status: "submitted" | "under-review" | "resolved"
  submittedBy: string
  submittedDate: string
  assignedTo?: string
  lastUpdate: string
}

export default function GrievancesPage() {
  const [userRole, setUserRole] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("form")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [newGrievance, setNewGrievance] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
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

  const grievances: Grievance[] = [
    {
      id: "1",
      title: "Delay in Salary Processing",
      description:
        "My salary for December has not been processed yet. This is causing financial difficulties for my family.",
      category: "housing",
      priority: "high",
      status: "under-review",
      submittedBy: "Maj. Patel",
      submittedDate: "2024-01-10",
      assignedTo: "Finance Officer",
      lastUpdate: "2024-01-15",
    },
    {
      id: "2",
      title: "Accommodation Heating Issues",
      description:
        "The heating system in family quarters Block C is not working properly. Multiple families are affected.",
      category: "housing",
      priority: "high",
      status: "submitted",
      submittedBy: "Capt. Singh",
      submittedDate: "2024-01-12",
      lastUpdate: "2024-01-14",
    },
    {
      id: "3",
      title: "Medical Facility Shortage",
      description: "The base hospital is facing shortage of essential medicines and equipment.",
      category: "medical",
      priority: "high",
      status: "submitted",
      submittedBy: "Dr. Kumar",
      submittedDate: "2024-01-14",
      lastUpdate: "2024-01-14",
    },
    {
      id: "4",
      title: "Training Equipment Malfunction",
      description: "Several training simulators are not functioning properly, affecting training schedules.",
      category: "education",
      priority: "medium",
      status: "resolved",
      submittedBy: "Lt. Sharma",
      submittedDate: "2024-01-08",
      assignedTo: "Training Wing",
      lastUpdate: "2024-01-13",
    },
    {
      id: "5",
      title: "Canteen Food Quality",
      description: "The quality of food served in the officers' mess has deteriorated significantly.",
      category: "other",
      priority: "low",
      status: "resolved",
      submittedBy: "Col. Gupta",
      submittedDate: "2024-01-05",
      assignedTo: "Mess Committee",
      lastUpdate: "2024-01-12",
    },
  ]

  const categories = [
    { value: "housing", label: "Housing" },
    { value: "medical", label: "Medical" },
    { value: "education", label: "Education" },
    { value: "other", label: "Other" },
  ]

  const priorities = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <FileText className="w-4 h-4 text-blue-500" />
      case "under-review":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "under-review":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
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

  const filteredGrievances = grievances.filter((grievance) => {
    const matchesSearch =
      grievance.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grievance.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || grievance.category === categoryFilter
    const matchesStatus = statusFilter === "all" || grievance.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const pendingGrievances = grievances.filter((g) => g.status === "submitted" || g.status === "under-review")
  const resolvedGrievances = grievances.filter((g) => g.status === "resolved")

  const handleSubmitGrievance = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitting grievance:", newGrievance)
    setNewGrievance({ title: "", description: "", category: "", priority: "" })
    setActiveTab("pending")
  }

  const handleAIHelp = () => {
    const aiSuggestion = `Formal Complaint: ${newGrievance.title}

Dear Sir/Madam,

I am writing to formally bring to your attention an issue regarding ${newGrievance.title.toLowerCase()}. 

${newGrievance.description}

I request your immediate attention to this matter and would appreciate a prompt resolution.

Thank you for your consideration.

Respectfully,
[Your Name]
[Your Rank]
[Your Unit]`

    setNewGrievance((prev) => ({ ...prev, description: aiSuggestion }))
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
              <h1 className="text-xl font-bold text-gray-900">Grievance Redressal System</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="form">File Complaint</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingGrievances.length})</TabsTrigger>
            <TabsTrigger value="resolved">Resolved ({resolvedGrievances.length})</TabsTrigger>
            <TabsTrigger value="all">All Complaints</TabsTrigger>
          </TabsList>

          {/* Complaint Filing Form */}
          {activeTab === "form" && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>File a New Complaint</CardTitle>
                <CardDescription>
                  Please provide detailed information about your complaint. All fields marked with * are required.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitGrievance} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="complaint-title">Complaint Title *</Label>
                    <Input
                      id="complaint-title"
                      placeholder="Brief description of the issue"
                      value={newGrievance.title}
                      onChange={(e) => setNewGrievance((prev) => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="complaint-category">Category *</Label>
                      <Select
                        value={newGrievance.category}
                        onValueChange={(value) => setNewGrievance((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="complaint-priority">Priority Level *</Label>
                      <Select
                        value={newGrievance.priority}
                        onValueChange={(value) => setNewGrievance((prev) => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem key={priority.value} value={priority.value}>
                              {priority.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="complaint-description">Complaint Description *</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAIHelp}
                        className="text-purple-600 border-purple-200 hover:bg-purple-50"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Help me write
                      </Button>
                    </div>
                    <Textarea
                      id="complaint-description"
                      placeholder="Provide detailed information about the issue, including when it occurred, who was involved, and what resolution you're seeking..."
                      value={newGrievance.description}
                      onChange={(e) => setNewGrievance((prev) => ({ ...prev, description: e.target.value }))}
                      rows={6}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="complaint-attachment">Upload Attachment (Optional)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PDF, DOC, JPG, PNG up to 10MB</p>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="submit" className="bg-red-600 hover:bg-red-700">
                      Submit Complaint
                    </Button>
                    <Button type="button" variant="outline">
                      Save as Draft
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Complaint Status Tracker */}
          {(activeTab === "pending" || activeTab === "resolved" || activeTab === "all") && (
            <div className="mt-6 space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search complaints..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full sm:w-48">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
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
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="under-review">Under Review</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Complaints Table */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {activeTab === "pending" && "Pending Complaints"}
                    {activeTab === "resolved" && "Resolved Complaints"}
                    {activeTab === "all" && "All Complaints"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Complaint Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date Submitted</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredGrievances
                          .filter((grievance) => {
                            if (activeTab === "pending")
                              return grievance.status === "submitted" || grievance.status === "under-review"
                            if (activeTab === "resolved") return grievance.status === "resolved"
                            return true
                          })
                          .map((grievance) => (
                            <TableRow key={grievance.id}>
                              <TableCell className="font-medium">
                                <div>
                                  <p className="font-semibold">{grievance.title}</p>
                                  <p className="text-sm text-gray-600 line-clamp-1">{grievance.description}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">
                                  {grievance.category}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={getPriorityColor(grievance.priority)}>
                                  {grievance.priority.toUpperCase()}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(grievance.status)}>
                                  <div className="flex items-center gap-1">
                                    {getStatusIcon(grievance.status)}
                                    {grievance.status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                  </div>
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(grievance.submittedDate).toLocaleDateString()}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">
                                    View
                                  </Button>
                                  {grievance.status !== "resolved" && (
                                    <Button size="sm" variant="outline">
                                      Update
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>

                  {filteredGrievances.length === 0 && (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints found</h3>
                      <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </Tabs>
      </main>
    </div>
  )
}
