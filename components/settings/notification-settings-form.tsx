"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Save, Mail, MessageSquare, Bell, Settings, AlertCircle } from "lucide-react"

interface NotificationSettingsFormProps {
  restaurantId: string
}

export function NotificationSettingsForm({ restaurantId }: NotificationSettingsFormProps) {
  const [loading, setLoading] = useState(false)
  const [loadingSettings, setLoadingSettings] = useState(true)
  const [formData, setFormData] = useState({
    // Email configuration
    emailProvider: "resend", // resend, sendgrid, smtp
    emailFromAddress: "",
    emailFromName: "",
    resendApiKey: "",
    sendgridApiKey: "",
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    smtpSecure: true,
    
    // SMS configuration
    smsProvider: "twilio", // twilio, messagebird, custom
    twilioAccountSid: "",
    twilioAuthToken: "",
    twilioPhoneNumber: "",
    messagebirdApiKey: "",
    messagebirdPhoneNumber: "",
    
    // Email notifications
    emailEnabled: true,
    emailOrderPlaced: true,
    emailOrderStatusChanged: true,
    emailPaymentReceived: true,
    emailBookingConfirmed: true,
    emailBookingReminder: true,
    emailDailySummary: false,
    emailWeeklyReport: false,
    
    // SMS notifications
    smsEnabled: false,
    smsOrderPlaced: true,
    smsOrderReady: true,
    smsPaymentReceived: false,
    smsBookingConfirmed: true,
    smsBookingReminder: true,
    
    // Notification preferences
    notifyOnNewOrder: true,
    notifyOnPayment: true,
    notifyOnBooking: true,
    notifyOnLowStock: false,
    notifyOnReview: true,
  })

  // Load saved settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch(`/api/notifications/config?restaurantId=${restaurantId}`)
        if (response.ok) {
          const data = await response.json()
          setFormData((prev) => ({ ...prev, ...data }))
        }
      } catch (error) {
        console.error("Error loading notification settings:", error)
      } finally {
        setLoadingSettings(false)
      }
    }

    loadSettings()
  }, [restaurantId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/notifications/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          ...formData,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert("Notification settings saved successfully!")
      } else {
        alert(data.error || "Failed to save notification settings")
      }
    } catch (error) {
      console.error("Error saving notification settings:", error)
      alert("Failed to save notification settings")
    } finally {
      setLoading(false)
    }
  }

  const ToggleSwitch = ({ 
    id, 
    checked, 
    onChange, 
    label, 
    description 
  }: { 
    id: string
    checked: boolean
    onChange: (checked: boolean) => void
    label: string
    description?: string
  }) => (
    <div className="flex items-start justify-between p-4 bg-[#0D0D0D] rounded-lg border border-[#2A2A2A]">
      <div className="flex-1">
        <Label htmlFor={id} className="text-white font-medium cursor-pointer">
          {label}
        </Label>
        {description && (
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        )}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-[#2A2A2A] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C97AFF]"></div>
      </label>
    </div>
  )

  if (loadingSettings) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading notification settings...</div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Provider Configuration */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-cyan-400" />
            <CardTitle className="text-white">Email Provider Configuration</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Configure your email service provider settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <AlertCircle className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-200 font-medium mb-1">Email Service Setup</p>
              <p className="text-sm text-blue-300/80 leading-relaxed">
                Configure your email provider to send transactional emails. For production, use a service like Resend, SendGrid, or SMTP.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailProvider" className="text-gray-400">
                Email Provider
              </Label>
              <select
                id="emailProvider"
                value={formData.emailProvider}
                onChange={(e) => setFormData({ ...formData, emailProvider: e.target.value })}
                className="w-full px-4 py-2 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[12px] text-white focus:outline-none focus:border-[#C97AFF]"
              >
                <option value="resend">Resend (Recommended)</option>
                <option value="sendgrid">SendGrid</option>
                <option value="smtp">Custom SMTP</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emailFromAddress" className="text-gray-400">
                  From Email Address
                </Label>
                <Input
                  id="emailFromAddress"
                  type="email"
                  value={formData.emailFromAddress}
                  onChange={(e) => setFormData({ ...formData, emailFromAddress: e.target.value })}
                  placeholder="noreply@yourrestaurant.com"
                  className="bg-[#0D0D0D] border-[#2A2A2A] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailFromName" className="text-gray-400">
                  From Name
                </Label>
                <Input
                  id="emailFromName"
                  type="text"
                  value={formData.emailFromName}
                  onChange={(e) => setFormData({ ...formData, emailFromName: e.target.value })}
                  placeholder="Your Restaurant Name"
                  className="bg-[#0D0D0D] border-[#2A2A2A] text-white"
                />
              </div>
            </div>

            {formData.emailProvider === "resend" && (
              <div className="space-y-2">
                <Label htmlFor="resendApiKey" className="text-gray-400">
                  Resend API Key
                </Label>
                <Input
                  id="resendApiKey"
                  type="password"
                  value={formData.resendApiKey}
                  onChange={(e) => setFormData({ ...formData, resendApiKey: e.target.value })}
                  placeholder="re_..."
                  className="bg-[#0D0D0D] border-[#2A2A2A] text-white font-mono"
                />
              </div>
            )}

            {formData.emailProvider === "sendgrid" && (
              <div className="space-y-2">
                <Label htmlFor="sendgridApiKey" className="text-gray-400">
                  SendGrid API Key
                </Label>
                <Input
                  id="sendgridApiKey"
                  type="password"
                  value={formData.sendgridApiKey}
                  onChange={(e) => setFormData({ ...formData, sendgridApiKey: e.target.value })}
                  placeholder="SG..."
                  className="bg-[#0D0D0D] border-[#2A2A2A] text-white font-mono"
                />
              </div>
            )}

            {formData.emailProvider === "smtp" && (
              <div className="space-y-4 p-4 bg-[#0D0D0D] rounded-lg border border-[#2A2A2A]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost" className="text-gray-400">
                      SMTP Host
                    </Label>
                    <Input
                      id="smtpHost"
                      type="text"
                      value={formData.smtpHost}
                      onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                      placeholder="smtp.gmail.com"
                      className="bg-[#0D0D0D] border-[#2A2A2A] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort" className="text-gray-400">
                      SMTP Port
                    </Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      value={formData.smtpPort}
                      onChange={(e) => setFormData({ ...formData, smtpPort: e.target.value })}
                      placeholder="587"
                      className="bg-[#0D0D0D] border-[#2A2A2A] text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpUser" className="text-gray-400">
                      SMTP Username
                    </Label>
                    <Input
                      id="smtpUser"
                      type="text"
                      value={formData.smtpUser}
                      onChange={(e) => setFormData({ ...formData, smtpUser: e.target.value })}
                      className="bg-[#0D0D0D] border-[#2A2A2A] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword" className="text-gray-400">
                      SMTP Password
                    </Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={formData.smtpPassword}
                      onChange={(e) => setFormData({ ...formData, smtpPassword: e.target.value })}
                      className="bg-[#0D0D0D] border-[#2A2A2A] text-white"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="smtpSecure"
                    checked={formData.smtpSecure}
                    onChange={(e) => setFormData({ ...formData, smtpSecure: e.target.checked })}
                    className="w-4 h-4 rounded border-[#2A2A2A] bg-[#0D0D0D] text-[#C97AFF] focus:ring-[#C97AFF]"
                  />
                  <Label htmlFor="smtpSecure" className="text-gray-300 cursor-pointer">
                    Use TLS/SSL
                  </Label>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SMS Provider Configuration */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-green-400" />
            <CardTitle className="text-white">SMS Provider Configuration</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Configure your SMS service provider settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <AlertCircle className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-green-200 font-medium mb-1">SMS Service Setup</p>
              <p className="text-sm text-green-300/80 leading-relaxed">
                Configure your SMS provider to send text notifications. Popular options include Twilio, MessageBird, or custom APIs.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smsProvider" className="text-gray-400">
                SMS Provider
              </Label>
              <select
                id="smsProvider"
                value={formData.smsProvider}
                onChange={(e) => setFormData({ ...formData, smsProvider: e.target.value })}
                className="w-full px-4 py-2 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[12px] text-white focus:outline-none focus:border-[#C97AFF]"
              >
                <option value="twilio">Twilio (Recommended)</option>
                <option value="messagebird">MessageBird</option>
                <option value="custom">Custom API</option>
              </select>
            </div>

            {formData.smsProvider === "twilio" && (
              <div className="space-y-4 p-4 bg-[#0D0D0D] rounded-lg border border-[#2A2A2A]">
                <div className="space-y-2">
                  <Label htmlFor="twilioAccountSid" className="text-gray-400">
                    Twilio Account SID
                  </Label>
                  <Input
                    id="twilioAccountSid"
                    type="text"
                    value={formData.twilioAccountSid}
                    onChange={(e) => setFormData({ ...formData, twilioAccountSid: e.target.value })}
                    placeholder="AC..."
                    className="bg-[#0D0D0D] border-[#2A2A2A] text-white font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twilioAuthToken" className="text-gray-400">
                    Twilio Auth Token
                  </Label>
                  <Input
                    id="twilioAuthToken"
                    type="password"
                    value={formData.twilioAuthToken}
                    onChange={(e) => setFormData({ ...formData, twilioAuthToken: e.target.value })}
                    placeholder="Enter your auth token"
                    className="bg-[#0D0D0D] border-[#2A2A2A] text-white font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twilioPhoneNumber" className="text-gray-400">
                    Twilio Phone Number
                  </Label>
                  <Input
                    id="twilioPhoneNumber"
                    type="tel"
                    value={formData.twilioPhoneNumber}
                    onChange={(e) => setFormData({ ...formData, twilioPhoneNumber: e.target.value })}
                    placeholder="+1234567890"
                    className="bg-[#0D0D0D] border-[#2A2A2A] text-white"
                  />
                </div>
              </div>
            )}

            {formData.smsProvider === "messagebird" && (
              <div className="space-y-4 p-4 bg-[#0D0D0D] rounded-lg border border-[#2A2A2A]">
                <div className="space-y-2">
                  <Label htmlFor="messagebirdApiKey" className="text-gray-400">
                    MessageBird API Key
                  </Label>
                  <Input
                    id="messagebirdApiKey"
                    type="password"
                    value={formData.messagebirdApiKey}
                    onChange={(e) => setFormData({ ...formData, messagebirdApiKey: e.target.value })}
                    placeholder="Enter your API key"
                    className="bg-[#0D0D0D] border-[#2A2A2A] text-white font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="messagebirdPhoneNumber" className="text-gray-400">
                    MessageBird Phone Number
                  </Label>
                  <Input
                    id="messagebirdPhoneNumber"
                    type="tel"
                    value={formData.messagebirdPhoneNumber}
                    onChange={(e) => setFormData({ ...formData, messagebirdPhoneNumber: e.target.value })}
                    placeholder="+1234567890"
                    className="bg-[#0D0D0D] border-[#2A2A2A] text-white"
                  />
                </div>
              </div>
            )}

            {formData.smsProvider === "custom" && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="text-sm text-amber-300">
                  Custom SMS API integration requires additional development. Contact support for assistance.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Email Notifications */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-cyan-400" />
            <CardTitle className="text-white">Email Notifications</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Configure email alerts for important events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ToggleSwitch
            id="emailEnabled"
            checked={formData.emailEnabled}
            onChange={(checked) => setFormData({ ...formData, emailEnabled: checked })}
            label="Enable Email Notifications"
            description="Master switch for all email notifications"
          />

          {formData.emailEnabled && (
            <div className="space-y-3 pl-4 border-l-2 border-[#2A2A2A]">
              <ToggleSwitch
                id="emailOrderPlaced"
                checked={formData.emailOrderPlaced}
                onChange={(checked) => setFormData({ ...formData, emailOrderPlaced: checked })}
                label="New Order Placed"
                description="Get notified when a new order is received"
              />
              <ToggleSwitch
                id="emailOrderStatusChanged"
                checked={formData.emailOrderStatusChanged}
                onChange={(checked) => setFormData({ ...formData, emailOrderStatusChanged: checked })}
                label="Order Status Updates"
                description="Notifications when order status changes"
              />
              <ToggleSwitch
                id="emailPaymentReceived"
                checked={formData.emailPaymentReceived}
                onChange={(checked) => setFormData({ ...formData, emailPaymentReceived: checked })}
                label="Payment Received"
                description="Alert when payment is successfully processed"
              />
              <ToggleSwitch
                id="emailBookingConfirmed"
                checked={formData.emailBookingConfirmed}
                onChange={(checked) => setFormData({ ...formData, emailBookingConfirmed: checked })}
                label="Booking Confirmed"
                description="Notify when a table reservation is confirmed"
              />
              <ToggleSwitch
                id="emailBookingReminder"
                checked={formData.emailBookingReminder}
                onChange={(checked) => setFormData({ ...formData, emailBookingReminder: checked })}
                label="Booking Reminders"
                description="Reminder emails before reservations"
              />
              <ToggleSwitch
                id="emailDailySummary"
                checked={formData.emailDailySummary}
                onChange={(checked) => setFormData({ ...formData, emailDailySummary: checked })}
                label="Daily Summary"
                description="Receive daily sales and activity summary"
              />
              <ToggleSwitch
                id="emailWeeklyReport"
                checked={formData.emailWeeklyReport}
                onChange={(checked) => setFormData({ ...formData, emailWeeklyReport: checked })}
                label="Weekly Report"
                description="Weekly analytics and performance report"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-green-400" />
            <CardTitle className="text-white">SMS Notifications</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Configure SMS alerts (requires SMS provider setup)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ToggleSwitch
            id="smsEnabled"
            checked={formData.smsEnabled}
            onChange={(checked) => setFormData({ ...formData, smsEnabled: checked })}
            label="Enable SMS Notifications"
            description="Master switch for all SMS notifications"
          />

          {formData.smsEnabled && (
            <div className="space-y-3 pl-4 border-l-2 border-[#2A2A2A]">
              <ToggleSwitch
                id="smsOrderPlaced"
                checked={formData.smsOrderPlaced}
                onChange={(checked) => setFormData({ ...formData, smsOrderPlaced: checked })}
                label="New Order Alert"
                description="SMS notification for new orders"
              />
              <ToggleSwitch
                id="smsOrderReady"
                checked={formData.smsOrderReady}
                onChange={(checked) => setFormData({ ...formData, smsOrderReady: checked })}
                label="Order Ready"
                description="Notify customers when order is ready"
              />
              <ToggleSwitch
                id="smsPaymentReceived"
                checked={formData.smsPaymentReceived}
                onChange={(checked) => setFormData({ ...formData, smsPaymentReceived: checked })}
                label="Payment Confirmation"
                description="SMS confirmation for payments"
              />
              <ToggleSwitch
                id="smsBookingConfirmed"
                checked={formData.smsBookingConfirmed}
                onChange={(checked) => setFormData({ ...formData, smsBookingConfirmed: checked })}
                label="Booking Confirmation"
                description="SMS confirmation for reservations"
              />
              <ToggleSwitch
                id="smsBookingReminder"
                checked={formData.smsBookingReminder}
                onChange={(checked) => setFormData({ ...formData, smsBookingReminder: checked })}
                label="Booking Reminder"
                description="SMS reminder before reservation time"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* In-App Notifications */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-white">In-App Notifications</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Control which events trigger in-app notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ToggleSwitch
            id="notifyOnNewOrder"
            checked={formData.notifyOnNewOrder}
            onChange={(checked) => setFormData({ ...formData, notifyOnNewOrder: checked })}
            label="New Orders"
            description="Show notification when new order arrives"
          />
          <ToggleSwitch
            id="notifyOnPayment"
            checked={formData.notifyOnPayment}
            onChange={(checked) => setFormData({ ...formData, notifyOnPayment: checked })}
            label="Payment Events"
            description="Notify on payment success or failure"
          />
          <ToggleSwitch
            id="notifyOnBooking"
            checked={formData.notifyOnBooking}
            onChange={(checked) => setFormData({ ...formData, notifyOnBooking: checked })}
            label="New Bookings"
            description="Alert when new reservation is made"
          />
          <ToggleSwitch
            id="notifyOnLowStock"
            checked={formData.notifyOnLowStock}
            onChange={(checked) => setFormData({ ...formData, notifyOnLowStock: checked })}
            label="Low Stock Alerts"
            description="Notify when items are running low (coming soon)"
          />
          <ToggleSwitch
            id="notifyOnReview"
            checked={formData.notifyOnReview}
            onChange={(checked) => setFormData({ ...formData, notifyOnReview: checked })}
            label="Customer Reviews"
            description="Alert when customer leaves a review (coming soon)"
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-[#C97AFF] to-[#6B7CFF] hover:from-[#B869E6] hover:to-[#5B6CE6] text-white border-0"
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Saving..." : "Save Notification Settings"}
        </Button>
      </div>
    </form>
  )
}

