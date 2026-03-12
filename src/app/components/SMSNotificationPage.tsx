import { useState } from 'react';
import { MessageSquare, Send, CheckCircle } from 'lucide-react';
import { toast, Toaster } from 'sonner';

const messageTemplates = [
  'Your assistance will be distributed on [DATE].',
  'Please visit the LGU office to claim your [RESOURCE].',
  'Your application has been approved. Claim date: [DATE].',
  'Reminder: Resource distribution at [LOCATION] on [DATE].',
];

const recentMessages = [
  { to: '08XXXXXXXXX', message: 'Your assistance will be distributed on April 25, 2025.', date: 'Apr 22, 2025', status: 'Sent' },
  { to: '08XXXXXXXXX', message: 'Please visit the LGU office to claim your Rice Seeds.', date: 'Apr 21, 2025', status: 'Sent' },
  { to: '08XXXXXXXXX', message: 'Your application has been approved.', date: 'Apr 20, 2025', status: 'Failed' },
  { to: '08XXXXXXXXX', message: 'Reminder: Resource distribution at Brgy. A on April 25.', date: 'Apr 19, 2025', status: 'Sent' },
];

export function SMSNotificationPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('Your assistance will be distributed on April 25, 2025.');
  const [sending, setSending] = useState(false);

  const handleSend = () => {
    if (!phoneNumber || !message) {
      toast.error('Please fill in all fields');
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success('SMS sent successfully!');
      setPhoneNumber('');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-green-700" />
        <h1>SMS Notification</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compose */}
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          <h3>Compose Message</h3>

          <div>
            <label className="text-sm text-gray-600">To:</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="08XXXXXXXXX"
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Template:</label>
            <select
              onChange={(e) => setMessage(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
            >
              {messageTemplates.map((t, i) => (
                <option key={i} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Message:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              maxLength={160}
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none"
            />
            <p className="text-xs text-gray-400 text-right">{message.length}/160</p>
          </div>

          <button
            onClick={handleSend}
            disabled={sending}
            className="w-full bg-green-700 hover:bg-green-800 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors disabled:opacity-50"
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Send SMS
          </button>
        </div>

        {/* History */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="mb-4">Recent Messages</h3>
          <div className="space-y-3">
            {recentMessages.map((msg, i) => (
              <div key={i} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">To: {msg.to}</span>
                  <div className="flex items-center gap-1">
                    <CheckCircle className={`w-3 h-3 ${msg.status === 'Sent' ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`text-xs ${msg.status === 'Sent' ? 'text-green-600' : 'text-red-600'}`}>{msg.status}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{msg.message}</p>
                <p className="text-xs text-gray-400 mt-1">{msg.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
