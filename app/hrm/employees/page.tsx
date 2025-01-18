"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/hrm/header'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PersonalInformation } from '@/components/hrm/employee/edit/PersonalInformation'
import { ContractInformation } from '@/components/hrm/employee/edit/ContractInformation'
import { VisaAndDocuments } from '@/components/hrm/employee/edit/VisaAndDocuments'
import { FamilyAndEmergency } from'@/components/hrm/employee/edit/FamilyAndEmergency'
import { EmployeePayroll } from '@/components/hrm/employee/edit/EmployeePayroll'
import { AddressBook } from '@/components/hrm/employee/edit/AddressBook'
import { QualificationsTraining } from '@/components/hrm/employee/edit/QualificationsTraining'
import { LeaveManagement } from '@/components/hrm/employee/edit/LeaveManagement'
import { BusinessTravel } from '@/components/hrm/employee/edit/BusinessTravel'
import { AssetManagement } from '@/components/hrm/employee/edit/AssetManagement'
import { PlusCircle } from 'lucide-react'

export default function AddEmployeePage() {
  const router = useRouter()

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Here you would typically send the form data to your backend
    console.log('Form submitted')
    router.push('/employees')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Add New Employee</h1>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2 mb-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="contract">Contract</TabsTrigger>
              <TabsTrigger value="visa">Visa & Documents</TabsTrigger>
              <TabsTrigger value="family">Family & Emergency</TabsTrigger>
              <TabsTrigger value="payroll">Payroll</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
              <TabsTrigger value="leave">Leave</TabsTrigger>
              <TabsTrigger value="travel">Travel</TabsTrigger>
              <TabsTrigger value="assets">Assets</TabsTrigger>
            </TabsList>
            <TabsContent value="personal">
              <PersonalInformation />
            </TabsContent>
            <TabsContent value="contract">
              <ContractInformation />
            </TabsContent>
            <TabsContent value="visa">
              <VisaAndDocuments />
            </TabsContent>
            <TabsContent value="family">
              <FamilyAndEmergency />
            </TabsContent>
            <TabsContent value="payroll">
              <EmployeePayroll />
            </TabsContent>
            <TabsContent value="address">
              <AddressBook />
            </TabsContent>
            <TabsContent value="qualifications">
              <QualificationsTraining />
            </TabsContent>
            <TabsContent value="leave">
              <LeaveManagement />
            </TabsContent>
            <TabsContent value="travel">
              <BusinessTravel />
            </TabsContent>
            <TabsContent value="assets">
              <AssetManagement />
            </TabsContent>
          </Tabs>
          <div className="mt-6">
            <Button type="submit" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

