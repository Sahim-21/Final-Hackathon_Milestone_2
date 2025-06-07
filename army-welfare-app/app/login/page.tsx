"use client"

import React, { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Shield, Users, UserCheck } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const [role, setRole] = useState("")
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    if (role && credentials.username && credentials.password) {
      try {
        setIsLoading(true)
        const response = await fetch("http://localhost:5000/api/auth/login", {

          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.username,
            password: credentials.password,
            role: role,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.msg || "Login failed")
        }

        // Store user session
        localStorage.setItem("userRole", role)
        localStorage.setItem("username", credentials.username)
        localStorage.setItem("token", data.token)
        
        router.push("/dashboard")
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Login failed")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const roles = [
    {
      value: "admin",
      label: "Administrator",
      icon: Shield,
      description: "Full system access",
    },
    {
      value: "officer",
      label: "Officer",
      icon: UserCheck,
      description: "Manage schemes and resources",
    },
    {
      value: "personnel",
      label: "Personnel",
      icon: Users,
      description: "Access welfare schemes",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">Army Welfare Portal</CardTitle>
          <CardDescription>Secure access to welfare management system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Select Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((roleOption) => (
                    <SelectItem key={roleOption.value} value={roleOption.value}>
                      <div className="flex items-center gap-2">
                        {React.createElement(roleOption.icon, { className: "w-4 h-4" })}
                        <div>
                          <div className="font-medium">{roleOption.label}</div>
                          <div className="text-xs text-muted-foreground">{roleOption.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={credentials.username}
                onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
