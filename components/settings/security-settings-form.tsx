"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Save, Lock, Shield, Smartphone, LogOut, AlertCircle, CheckCircle2, Eye, EyeOff, QrCode, Copy, X, Trash2 } from "lucide-react"

export function SecuritySettingsForm() {
  const [loading, setLoading] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [twoFactorLoading, setTwoFactorLoading] = useState(false)
  const [twoFactorSetup, setTwoFactorSetup] = useState<{
    qrCode: string
    manualEntryKey: string
  } | null>(null)
  const [verificationCode, setVerificationCode] = useState("")
  const [verificationError, setVerificationError] = useState("")
  const [disablePassword, setDisablePassword] = useState("")
  const [disableToken, setDisableToken] = useState("")
  const [disableError, setDisableError] = useState("")
  
  const [sessions, setSessions] = useState<Array<{
    id: string
    device: string
    browser: string
    os: string
    ipAddress: string
    location: string
    lastActive: string
    createdAt: string
    isCurrent: boolean
  }>>([])
  const [sessionsLoading, setSessionsLoading] = useState(true)
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(null)

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long"
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter"
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter"
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number"
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character"
    }
    return null
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setPasswordSuccess("")

    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError("All fields are required")
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    const validationError = validatePassword(passwordForm.newPassword)
    if (validationError) {
      setPasswordError(validationError)
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setPasswordSuccess("Password updated successfully!")
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
        setTimeout(() => setPasswordSuccess(""), 5000)
      } else {
        setPasswordError(data.error || "Failed to update password")
      }
    } catch (error) {
      console.error("Error changing password:", error)
      setPasswordError("Failed to update password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Load 2FA status and sessions on mount
  useEffect(() => {
    const load2FAStatus = async () => {
      try {
        const response = await fetch("/api/auth/two-factor/status")
        if (response.ok) {
          const data = await response.json()
          setTwoFactorEnabled(data.enabled)
        }
      } catch (error) {
        console.error("Error loading 2FA status:", error)
      }
    }
    
    const loadSessions = async () => {
      setSessionsLoading(true)
      try {
        const response = await fetch("/api/auth/sessions")
        if (response.ok) {
          const data = await response.json()
          // Mark current session (you can enhance this by comparing session tokens)
          const sessionsWithCurrent = data.sessions.map((s: any, index: number) => ({
            ...s,
            isCurrent: index === 0, // First session is usually the current one
          }))
          setSessions(sessionsWithCurrent)
        }
      } catch (error) {
        console.error("Error loading sessions:", error)
      } finally {
        setSessionsLoading(false)
      }
    }
    
    load2FAStatus()
    loadSessions()
  }, [])
  
  const handleRevokeSession = async (sessionId: string) => {
    if (!confirm("Are you sure you want to revoke this session? The user will be logged out from that device.")) {
      return
    }
    
    setRevokingSessionId(sessionId)
    try {
      const response = await fetch(`/api/auth/sessions/${sessionId}`, {
        method: "DELETE",
      })
      
      if (response.ok) {
        // Remove session from list
        setSessions(sessions.filter((s) => s.id !== sessionId))
      } else {
        alert("Failed to revoke session")
      }
    } catch (error) {
      console.error("Error revoking session:", error)
      alert("Failed to revoke session")
    } finally {
      setRevokingSessionId(null)
    }
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString()
  }

  const handleSetup2FA = async () => {
    setTwoFactorLoading(true)
    setVerificationError("")
    try {
      const response = await fetch("/api/auth/two-factor/setup")
      if (response.ok) {
        const data = await response.json()
        if (data.enabled) {
          setTwoFactorEnabled(true)
        } else {
          setTwoFactorSetup({
            qrCode: data.qrCode,
            manualEntryKey: data.manualEntryKey,
          })
        }
      } else {
        const error = await response.json()
        setVerificationError(error.error || "Failed to set up 2FA")
      }
    } catch (error) {
      console.error("Error setting up 2FA:", error)
      setVerificationError("Failed to set up 2FA. Please try again.")
    } finally {
      setTwoFactorLoading(false)
    }
  }

  const handleVerify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setVerificationError("Please enter a 6-digit verification code")
      return
    }

    setTwoFactorLoading(true)
    setVerificationError("")
    try {
      const response = await fetch("/api/auth/two-factor/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: verificationCode }),
      })

      if (response.ok) {
        setTwoFactorEnabled(true)
        setTwoFactorSetup(null)
        setVerificationCode("")
      } else {
        const error = await response.json()
        setVerificationError(error.error || "Invalid verification code")
      }
    } catch (error) {
      console.error("Error verifying 2FA:", error)
      setVerificationError("Failed to verify code. Please try again.")
    } finally {
      setTwoFactorLoading(false)
    }
  }

  const handleDisable2FA = async () => {
    if (!disablePassword || !disableToken) {
      setDisableError("Password and verification code are required")
      return
    }

    if (disableToken.length !== 6) {
      setDisableError("Please enter a 6-digit verification code")
      return
    }

    setTwoFactorLoading(true)
    setDisableError("")
    try {
      const response = await fetch("/api/auth/two-factor/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: disablePassword,
          token: disableToken,
        }),
      })

      if (response.ok) {
        setTwoFactorEnabled(false)
        setDisablePassword("")
        setDisableToken("")
      } else {
        const error = await response.json()
        setDisableError(error.error || "Failed to disable 2FA")
      }
    } catch (error) {
      console.error("Error disabling 2FA:", error)
      setDisableError("Failed to disable 2FA. Please try again.")
    } finally {
      setTwoFactorLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const PasswordInput = ({
    id,
    label,
    value,
    onChange,
    show,
    onToggleShow,
    placeholder,
  }: {
    id: string
    label: string
    value: string
    onChange: (value: string) => void
    show: boolean
    onToggleShow: () => void
    placeholder?: string
  }) => (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-gray-400">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-[#0D0D0D] border-[#2A2A2A] text-white pr-10"
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-cyan-400" />
            <CardTitle className="text-white">Change Password</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Update your account password to keep it secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {passwordError && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{passwordError}</p>
              </div>
            )}

            {passwordSuccess && (
              <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                <p className="text-sm text-green-300">{passwordSuccess}</p>
              </div>
            )}

            <PasswordInput
              id="currentPassword"
              label="Current Password"
              value={passwordForm.currentPassword}
              onChange={(value) => setPasswordForm({ ...passwordForm, currentPassword: value })}
              show={showPasswords.current}
              onToggleShow={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
              placeholder="Enter your current password"
            />

            <PasswordInput
              id="newPassword"
              label="New Password"
              value={passwordForm.newPassword}
              onChange={(value) => setPasswordForm({ ...passwordForm, newPassword: value })}
              show={showPasswords.new}
              onToggleShow={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
              placeholder="Enter your new password"
            />

            <PasswordInput
              id="confirmPassword"
              label="Confirm New Password"
              value={passwordForm.confirmPassword}
              onChange={(value) => setPasswordForm({ ...passwordForm, confirmPassword: value })}
              show={showPasswords.confirm}
              onToggleShow={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
              placeholder="Confirm your new password"
            />

            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-200 font-medium mb-2">Password Requirements:</p>
              <ul className="text-sm text-blue-300/80 space-y-1 list-disc list-inside">
                <li>At least 8 characters long</li>
                <li>Contains uppercase and lowercase letters</li>
                <li>Contains at least one number</li>
                <li>Contains at least one special character</li>
              </ul>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-[#C97AFF] to-[#6B7CFF] hover:from-[#B869E6] hover:to-[#5B6CE6] text-white border-0"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-green-400" />
            <CardTitle className="text-white">Two-Factor Authentication</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between p-4 bg-[#0D0D0D] rounded-lg border border-[#2A2A2A]">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Label className="text-white font-medium">Enable 2FA</Label>
                {twoFactorEnabled && (
                  <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                    Active
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400">
                Require a verification code in addition to your password when signing in
              </p>
            </div>
            {!twoFactorEnabled && !twoFactorSetup && (
              <Button
                onClick={handleSetup2FA}
                disabled={twoFactorLoading}
                className="bg-gradient-to-r from-[#11C97A] to-[#0FA968] hover:from-[#0FA968] hover:to-[#0D8F5A] text-white border-0"
              >
                <QrCode className="h-4 w-4 mr-2" />
                {twoFactorLoading ? "Setting up..." : "Set Up 2FA"}
              </Button>
            )}
          </div>

          {/* 2FA Setup Flow */}
          {twoFactorSetup && !twoFactorEnabled && (
            <div className="space-y-4 p-4 bg-[#0D0D0D] rounded-lg border border-[#2A2A2A]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Scan QR Code</h3>
                <button
                  onClick={() => setTwoFactorSetup(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-white rounded-lg">
                  <img src={twoFactorSetup.qrCode} alt="2FA QR Code" className="w-48 h-48" />
                </div>

                <div className="w-full space-y-2">
                  <Label className="text-gray-400">Or enter this code manually:</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={twoFactorSetup.manualEntryKey}
                      readOnly
                      className="bg-[#1A1A1A] border-[#2A2A2A] text-white font-mono"
                    />
                    <Button
                      type="button"
                      onClick={() => copyToClipboard(twoFactorSetup.manualEntryKey)}
                      className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="w-full space-y-2">
                  <Label htmlFor="verificationCode" className="text-gray-400">
                    Enter verification code from your app:
                  </Label>
                  <Input
                    id="verificationCode"
                    type="text"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="bg-[#1A1A1A] border-[#2A2A2A] text-white text-center text-2xl tracking-widest"
                  />
                  {verificationError && (
                    <p className="text-sm text-red-400">{verificationError}</p>
                  )}
                </div>

                <Button
                  onClick={handleVerify2FA}
                  disabled={twoFactorLoading || verificationCode.length !== 6}
                  className="w-full bg-gradient-to-r from-[#11C97A] to-[#0FA968] hover:from-[#0FA968] hover:to-[#0D8F5A] text-white border-0"
                >
                  {twoFactorLoading ? "Verifying..." : "Verify and Enable"}
                </Button>
              </div>
            </div>
          )}

          {/* 2FA Enabled State */}
          {twoFactorEnabled && !twoFactorSetup && (
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-sm text-green-200">
                  Two-factor authentication is enabled. You'll be asked for a verification code when signing in.
                </p>
              </div>

              {/* Disable 2FA */}
              <div className="p-4 bg-[#0D0D0D] rounded-lg border border-[#2A2A2A]">
                <h3 className="text-white font-medium mb-4">Disable 2FA</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="disablePassword" className="text-gray-400">
                      Current Password
                    </Label>
                    <Input
                      id="disablePassword"
                      type="password"
                      value={disablePassword}
                      onChange={(e) => setDisablePassword(e.target.value)}
                      placeholder="Enter your password"
                      className="bg-[#1A1A1A] border-[#2A2A2A] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="disableToken" className="text-gray-400">
                      Verification Code
                    </Label>
                    <Input
                      id="disableToken"
                      type="text"
                      maxLength={6}
                      value={disableToken}
                      onChange={(e) => setDisableToken(e.target.value.replace(/\D/g, ""))}
                      placeholder="000000"
                      className="bg-[#1A1A1A] border-[#2A2A2A] text-white text-center"
                    />
                  </div>
                  {disableError && (
                    <p className="text-sm text-red-400">{disableError}</p>
                  )}
                  <Button
                    onClick={handleDisable2FA}
                    disabled={twoFactorLoading || !disablePassword || disableToken.length !== 6}
                    className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                  >
                    {twoFactorLoading ? "Disabling..." : "Disable 2FA"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Preferences */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-white">Security Preferences</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between p-4 bg-[#0D0D0D] rounded-lg border border-[#2A2A2A]">
            <div className="flex-1">
              <Label className="text-white font-medium">Email Notifications for Security Events</Label>
              <p className="text-sm text-gray-400 mt-1">
                Receive email alerts for login attempts and security changes
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#2A2A2A] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C97AFF]"></div>
            </label>
          </div>

          <div className="flex items-start justify-between p-4 bg-[#0D0D0D] rounded-lg border border-[#2A2A2A]">
            <div className="flex-1">
              <Label className="text-white font-medium">Require Password for Sensitive Actions</Label>
              <p className="text-sm text-gray-400 mt-1">
                Ask for password confirmation before changing critical settings
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#2A2A2A] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C97AFF]"></div>
            </label>
          </div>

          <div className="flex items-start justify-between p-4 bg-[#0D0D0D] rounded-lg border border-[#2A2A2A]">
            <div className="flex-1">
              <Label className="text-white font-medium">Session Timeout</Label>
              <p className="text-sm text-gray-400 mt-1">
                Automatically log out after 30 minutes of inactivity
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#2A2A2A] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C97AFF]"></div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <LogOut className="h-5 w-5 text-orange-400" />
            <CardTitle className="text-white">Active Sessions</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Manage your active login sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-400">Loading sessions...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-300">
                No active sessions found. Sessions will appear here after you log in from different devices.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-start justify-between p-4 bg-[#0D0D0D] rounded-lg border border-[#2A2A2A]"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-medium">
                        {session.device} • {session.browser}
                      </p>
                      {session.isCurrent && (
                        <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      {session.os} • Last active: {formatDate(session.lastActive)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      IP: {session.ipAddress} • {session.location}
                    </p>
                  </div>
                  {!session.isCurrent && (
                    <Button
                      onClick={() => handleRevokeSession(session.id)}
                      disabled={revokingSessionId === session.id}
                      className="ml-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              {sessions.length > 1 && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-sm text-amber-300">
                    You have {sessions.length} active session{sessions.length > 1 ? "s" : ""}. 
                    Revoke any session you don't recognize to secure your account.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

