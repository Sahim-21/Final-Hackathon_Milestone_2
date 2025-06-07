"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Users,
  FileText,
  Phone,
  Package,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [userRole, setUserRole] = useState("")
  const [username, setUsername] = useState("")
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    const user = localStorage.getItem("username")
    if (!role || !user) {
      router.push("/login")
    } else {
      setUserRole(role)
      setUsername(user)
    }
  }, [router])

  const getQuickStats = () => {
    switch (userRole) {
      case "admin":
        return [
          { label: "Total Schemes", value: "24", icon: FileText, color: "bg-blue-500" },
          { label: "Active Users", value: "1,247", icon: Users, color: "bg-green-500" },
          { label: "Pending Grievances", value: "8", icon: AlertTriangle, color: "bg-yellow-500" },
          { label: "Resources Shared", value: "156", icon: Package, color: "bg-purple-500" },
        ]
      case "officer":
        return [
          { label: "Managed Schemes", value: "12", icon: FileText, color: "bg-blue-500" },
          { label: "Team Members", value: "45", icon: Users, color: "bg-green-500" },
          { label: "Resolved Issues", value: "23", icon: CheckCircle, color: "bg-green-500" },
          { label: "Emergency Contacts", value: "18", icon: Phone, color: "bg-red-500" },
        ]
      default:
        return [
          { label: "Available Schemes", value: "18", icon: FileText, color: "bg-blue-500" },
          { label: "My Applications", value: "3", icon: TrendingUp, color: "bg-green-500" },
          { label: "Emergency Contacts", value: "12", icon: Phone, color: "bg-red-500" },
          { label: "Shared Resources", value: "7", icon: Package, color: "bg-purple-500" },
        ]
    }
  }

  const getQuickActions = () => {
    const baseActions = [
      {
        title: "Welfare Schemes",
        description: "Browse and manage welfare schemes",
        href: "/welfare-schemes",
        icon: FileText,
      },
      {
        title: "Emergency Contacts",
        description: "Access emergency contact network",
        href: "/emergency-contacts",
        icon: Phone,
      },
      {
        title: "Resource Marketplace",
        description: "Share and request resources",
        href: "/marketplace",
        icon: Package,
      },
      {
        title: "Grievance System",
        description: "Submit and track complaints",
        href: "/grievances",
        icon: MessageSquare,
      },
    ]

    if (userRole === "admin") {
      return [
        {
          title: "System Administration",
          description: "Manage users and system settings",
          href: "/admin",
          icon: Shield,
        },
        ...baseActions,
      ]
    }

    return baseActions
  }

  const getRoleColor = () => {
    switch (userRole) {
      case "admin":
        return "bg-red-500"
      case "officer":
        return "bg-blue-500"
      default:
        return "bg-green-500"
    }
  }

  if (!userRole) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-green-600" />
              <h1 className="text-xl font-bold text-gray-900">Army Welfare Portal</h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={`${getRoleColor()} text-white`}>
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </Badge>
              <span className="text-sm text-gray-600">Welcome, {username}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.clear()
                  router.push("/login")
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">
            {userRole === "admin" && "Manage the entire welfare system and oversee operations."}
            {userRole === "officer" && "Coordinate welfare schemes and support your team."}
            {userRole === "personnel" && "Access welfare schemes and resources available to you."}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {getQuickStats().map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-full`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getQuickActions().map((action, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <Link href={action.href}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <action.icon className="w-5 h-5 text-green-600" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{action.description}</CardDescription>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
