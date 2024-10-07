import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CalendarDays, Users, ArrowRight, Plus, Edit } from 'lucide-react'

interface Organization {
  id: number
  name: string
  logo: string
  description: string
  createdAt: string
  memberCount: number
  industry: string
  tags: string[]
}

const initialOrganizations: Organization[] = [
  {
    id: 1,
    name: "Acme Corp",
    logo: "https://api.dicebear.com/6.x/shapes/svg?seed=AC&backgroundColor=00897b",
    description: "Leading provider of innovative solutions for businesses worldwide.",
    createdAt: "2023-01-15",
    memberCount: 250,
    industry: "Technology",
    tags: ["Innovation", "B2B", "SaaS"]
  },
  {
    id: 2,
    name: "TechNova",
    logo: "https://api.dicebear.com/6.x/shapes/svg?seed=TN&backgroundColor=1565c0",
    description: "Cutting-edge technology company specializing in AI and machine learning.",
    createdAt: "2023-03-22",
    memberCount: 120,
    industry: "Artificial Intelligence",
    tags: ["AI", "Machine Learning", "Big Data"]
  },
  {
    id: 3,
    name: "GreenEarth",
    logo: "https://api.dicebear.com/6.x/shapes/svg?seed=GE&backgroundColor=2e7d32",
    description: "Eco-friendly solutions for a sustainable future.",
    createdAt: "2023-05-10",
    memberCount: 80,
    industry: "Environmental",
    tags: ["Sustainability", "Clean Energy", "Recycling"]
  },
  {
    id: 4,
    name: "HealthPlus",
    logo: "https://api.dicebear.com/6.x/shapes/svg?seed=HP&backgroundColor=c62828",
    description: "Innovative healthcare solutions improving lives globally.",
    createdAt: "2023-07-05",
    memberCount: 150,
    industry: "Healthcare",
    tags: ["MedTech", "Telemedicine", "Wellness"]
  }
]

const OrganizationCard: React.FC<{ org: Organization; onEdit: (org: Organization) => void }> = ({ org, onEdit }) => (
  <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-none">
    <CardHeader className="flex flex-row items-center gap-4 pb-2">
      <Avatar className="h-20 w-20 rounded-xl border-2 border-primary/10">
        <AvatarImage src={org.logo} alt={org.name} />
        <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
          {org.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold leading-none">{org.name}</h3>
        <p className="text-sm text-muted-foreground">{org.industry}</p>
        <div className="flex flex-wrap gap-1 pt-1">
          {org.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{org.description}</p>
    </CardContent>
    <CardFooter className="flex flex-col space-y-2 pt-4 border-t">
      <div className="flex justify-between w-full text-sm text-muted-foreground">
        <div className="flex items-center">
          <CalendarDays className="mr-2 h-4 w-4" />
          {new Date(org.createdAt).toLocaleDateString()}
        </div>
        <div className="flex items-center">
          <Users className="mr-2 h-4 w-4" />
          {org.memberCount} members
        </div>
      </div>
      <div className="flex justify-between w-full">
        <Button variant="outline" onClick={() => onEdit(org)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button variant="outline">
          View Profile
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </CardFooter>
  </Card>
)

const SkeletonCard: React.FC = () => (
  <Card className="w-full overflow-hidden">
    <CardHeader className="flex flex-row items-center gap-4 pb-2">
      <Skeleton className="h-20 w-20 rounded-xl" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-1 pt-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6" />
    </CardContent>
    <CardFooter className="flex flex-col space-y-2 pt-4 border-t">
      <div className="flex justify-between w-full">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex justify-between w-full">
        <Skeleton className="h-9 w-24 rounded" />
        <Skeleton className="h-9 w-32 rounded" />
      </div>
    </CardFooter>
  </Card>
)

const OrganizationForm: React.FC<{
  org?: Organization;
  onSubmit: (org: Omit<Organization, 'id'>) => void;
  onCancel: () => void;
}> = ({ org, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Organization, 'id'>>({
    name: org?.name || '',
    logo: org?.logo || '',
    description: org?.description || '',
    createdAt: org?.createdAt || new Date().toISOString().split('T')[0],
    memberCount: org?.memberCount || 0,
    industry: org?.industry || '',
    tags: org?.tags || [],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Organization Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="logo">Logo URL</Label>
        <Input id="logo" name="logo" value={formData.logo} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="industry">Industry</Label>
        <Input id="industry" name="industry" value={formData.industry} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="memberCount">Member Count</Label>
        <Input id="memberCount" name="memberCount" type="number" value={formData.memberCount} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input id="tags" name="tags" value={formData.tags.join(', ')} onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()) }))} />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{org ? 'Update' : 'Create'} Organization</Button>
      </div>
    </form>
  )
}

export default function OrganizationListCRUD() {
  const [loading, setLoading] = useState(true)
  const [orgs, setOrgs] = useState<Organization[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null)

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setOrgs(initialOrganizations)
      setLoading(false)
    }, 2000)
  }, [])

  const handleCreateOrg = (newOrg: Omit<Organization, 'id'>) => {
    const orgWithId = { ...newOrg, id: Date.now() }
    setOrgs(prev => [...prev, orgWithId])
    setIsCreateModalOpen(false)
  }

  const handleEditOrg = (updatedOrg: Omit<Organization, 'id'>) => {
    setOrgs(prev => prev.map(org => org.id === editingOrg?.id ? { ...updatedOrg, id: org.id } : org))
    setEditingOrg(null)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <header className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
          Organizations
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover and connect with leading companies shaping the future of technology and innovation
        </p>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Organization
        </Button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
          : orgs.map(org => <OrganizationCard key={org.id} org={org} onEdit={setEditingOrg} />)
        }
      </div>
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Organization</DialogTitle>
          </DialogHeader>
          <OrganizationForm onSubmit={handleCreateOrg} onCancel={() => setIsCreateModalOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingOrg} onOpenChange={() => setEditingOrg(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Organization</DialogTitle>
          </DialogHeader>
          {editingOrg && (
            <OrganizationForm org={editingOrg} onSubmit={handleEditOrg} onCancel={() => setEditingOrg(null)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}