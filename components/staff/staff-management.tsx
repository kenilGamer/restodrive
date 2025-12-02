"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Plus,
  Edit,
  Trash2,
  UserPlus,
  Users,
  ChefHat,
  CreditCard,
  UtensilsCrossed,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  Key,
  X,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { StaffRole } from "@prisma/client"

interface StaffManagementProps {
  restaurantId: string
  branches: Array<{ id: string; name: string }>
}

interface Staff {
  id: string
  name: string
  email?: string
  phone: string
  role: StaffRole
  pin?: string
  isActive: boolean
  branchId?: string
  branch?: {
    id: string
    name: string
  }
  createdAt: string
}

const roleConfig = {
  MANAGER: {
    label: "Manager",
    icon: UserCheck,
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    description: "Full access to restaurant operations",
  },
  WAITER: {
    label: "Waiter",
    icon: UtensilsCrossed,
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    description: "Take orders and serve customers",
  },
  CASHIER: {
    label: "Cashier",
    icon: CreditCard,
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    description: "Handle payments and transactions",
  },
  KITCHEN_STAFF: {
    label: "Kitchen Staff",
    icon: ChefHat,
    color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    description: "Prepare and manage kitchen orders",
  },
  HOST: {
    label: "Host",
    icon: Users,
    color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    description: "Manage reservations and seating",
  },
}

export function StaffManagement({ restaurantId, branches }: StaffManagementProps) {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [filterRole, setFilterRole] = useState<StaffRole | "ALL">("ALL")
  const [filterActive, setFilterActive] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL")

  useEffect(() => {
    fetchStaff()
  }, [restaurantId])

  const fetchStaff = async () => {
    try {
      const response = await fetch(`/api/staff?restaurantId=${restaurantId}`)
      const data = await response.json()
      setStaff(data.staff || [])
    } catch (error) {
      console.error("Error fetching staff:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (staffId: string) => {
    if (!confirm("Are you sure you want to delete this staff member?")) {
      return
    }

    try {
      const response = await fetch(`/api/staff/${staffId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchStaff()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to delete staff member")
      }
    } catch (error) {
      console.error("Error deleting staff:", error)
      alert("Failed to delete staff member")
    }
  }

  const handleToggleActive = async (staff: Staff) => {
    try {
      const response = await fetch(`/api/staff/${staff.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !staff.isActive }),
      })

      if (response.ok) {
        fetchStaff()
      }
    } catch (error) {
      console.error("Error updating staff:", error)
    }
  }

  const filteredStaff = staff.filter((member) => {
    const roleMatch = filterRole === "ALL" || member.role === filterRole
    const activeMatch =
      filterActive === "ALL" ||
      (filterActive === "ACTIVE" && member.isActive) ||
      (filterActive === "INACTIVE" && !member.isActive)
    return roleMatch && activeMatch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading staff...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-cyan-400" />
                <span className="text-white font-semibold">{staff.length}</span>
                <span className="text-gray-400">Total Staff</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-green-400" />
                <span className="text-white font-semibold">
                  {staff.filter((s) => s.isActive).length}
                </span>
                <span className="text-gray-400">Active</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <Button
          onClick={() => {
            setEditingStaff(null)
            setShowModal(true)
          }}
          className="bg-cyan-500 hover:bg-cyan-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Role:</span>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as StaffRole | "ALL")}
                className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg px-3 py-1.5 text-white text-sm"
              >
                <option value="ALL">All Roles</option>
                {Object.keys(roleConfig).map((role) => (
                  <option key={role} value={role}>
                    {roleConfig[role as StaffRole].label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Status:</span>
              <select
                value={filterActive}
                onChange={(e) =>
                  setFilterActive(e.target.value as "ALL" | "ACTIVE" | "INACTIVE")
                }
                className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg px-3 py-1.5 text-white text-sm"
              >
                <option value="ALL">All</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Grid */}
      {filteredStaff.length === 0 ? (
        <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
          <CardContent className="p-12 text-center">
            <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Staff Members</h3>
            <p className="text-gray-400 mb-6">Get started by adding your first staff member</p>
            <Button
              onClick={() => {
                setEditingStaff(null)
                setShowModal(true)
              }}
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Staff Member
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredStaff.map((member, index) => {
              const roleInfo = roleConfig[member.role]
              const RoleIcon = roleInfo.icon

              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow ${
                      !member.isActive ? "opacity-60" : ""
                    }`}
                  >
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${roleInfo.color} border`}
                          >
                            <RoleIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                            <div
                              className={`px-2 py-0.5 rounded-full text-xs font-medium border ${roleInfo.color}`}
                            >
                              {roleInfo.label}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingStaff(member)
                              setShowModal(true)
                            }}
                            className="h-8 w-8 text-gray-400 hover:text-cyan-400"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(member.id)}
                            className="h-8 w-8 text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 mb-4">
                        {member.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Phone className="h-4 w-4" />
                            {member.phone}
                          </div>
                        )}
                        {member.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Mail className="h-4 w-4" />
                            {member.email}
                          </div>
                        )}
                        {member.branch && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <MapPin className="h-4 w-4" />
                            {member.branch.name}
                          </div>
                        )}
                        {member.pin && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Key className="h-4 w-4" />
                            PIN: ••••
                          </div>
                        )}
                      </div>

                      {/* Status Toggle */}
                      <Button
                        onClick={() => handleToggleActive(member)}
                        variant="outline"
                        className={`w-full ${
                          member.isActive
                            ? "border-green-500/30 text-green-400 hover:bg-green-500/10"
                            : "border-gray-500/30 text-gray-400 hover:bg-gray-500/10"
                        }`}
                      >
                        {member.isActive ? "Active" : "Inactive"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <StaffModal
          staff={editingStaff}
          restaurantId={restaurantId}
          branches={branches}
          onClose={() => {
            setShowModal(false)
            setEditingStaff(null)
          }}
          onSuccess={() => {
            fetchStaff()
            setShowModal(false)
            setEditingStaff(null)
          }}
        />
      )}
    </div>
  )
}

function StaffModal({
  staff,
  restaurantId,
  branches,
  onClose,
  onSuccess,
}: {
  staff: Staff | null
  restaurantId: string
  branches: Array<{ id: string; name: string }>
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState({
    name: staff?.name || "",
    email: staff?.email || "",
    phone: staff?.phone || "",
    role: (staff?.role || "WAITER") as StaffRole,
    pin: "",
    branchId: staff?.branchId || "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = staff ? `/api/staff/${staff.id}` : "/api/staff"
      const method = staff ? "PATCH" : "POST"

      const body = {
        ...formData,
        restaurantId,
        branchId: formData.branchId || null,
        pin: formData.pin || undefined,
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (response.ok) {
        onSuccess()
      } else {
        alert(data.error || "Failed to save staff member")
      }
    } catch (error) {
      console.error("Error saving staff:", error)
      alert("Failed to save staff member")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-[22px] shadow-glow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {staff ? "Edit Staff Member" : "Add Staff Member"}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Role *</label>
              <select
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as StaffRole })}
                className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                {Object.keys(roleConfig).map((role) => (
                  <option key={role} value={role}>
                    {roleConfig[role as StaffRole].label}
                  </option>
                ))}
              </select>
            </div>

            {branches.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Branch</label>
                <select
                  value={formData.branchId}
                  onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="">All Branches</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                PIN (for POS login)
              </label>
              <input
                type="password"
                value={formData.pin}
                onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                placeholder={staff ? "Leave blank to keep current PIN" : "4-6 digits"}
                className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-[#2A2A2A] text-gray-400 hover:bg-[#0D0D0D]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                {loading ? "Saving..." : staff ? "Update" : "Add Staff"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

