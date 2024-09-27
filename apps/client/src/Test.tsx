import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Building2 } from 'lucide-react'

export default function CreateOrganization() {
  const [orgName, setOrgName] = useState('')
  const [employeeCount, setEmployeeCount] = useState('1-5')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Organization Name:', orgName)
    console.log('Employee Count:', employeeCount)
  }

  return (
       <div  >
        <div className="flex items-center space-x-2">
          <Building2 className="h-8 w-8 text-purple-600" />
          <h1 className="text-2xl font-semibold text-gray-900">Create an Organization</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="orgName" className="text-sm font-medium text-gray-700">
              Organization name
            </Label>
            <Input
              id="orgName"
              placeholder="Your Organization name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-500">
              E.g. your company name or your workspace name.
            </p>
            {orgName.length > 0 && orgName.length < 3 && (
              <p className="text-xs text-red-500">
                String must contain at least 3 character(s)
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Number of employees
            </Label>
            <RadioGroup
              value={employeeCount}
              onValueChange={setEmployeeCount}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1-5" id="1-5" className="border-gray-300 text-purple-600" />
                <Label htmlFor="1-5" className="text-sm text-gray-700">1-5</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="6-49" id="6-49" className="border-gray-300 text-purple-600" />
                <Label htmlFor="6-49" className="text-sm text-gray-700">6-49</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="50-99" id="50-99" className="border-gray-300 text-purple-600" />
                <Label htmlFor="50-99" className="text-sm text-gray-700">50-99</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="100+" id="100+" className="border-gray-300 text-purple-600" />
                <Label htmlFor="100+" className="text-sm text-gray-700">100+</Label>
              </div>
            </RadioGroup>
          </div>
           
        </form>
      </div>
   )
}