/*
HealthGuardAI Dashboard - Full Functional Version for SIH Hackathon (Fixed)

This file is a single-file React component (JSX) intended to be dropped into a Vite/CRA
project (src/App.jsx) with Tailwind CSS. It contains the full functional app used in the
hackathon demo: Report Case form, Water Quality simulation, AI predictions, Alerts, 
multilingual UI, offline queue, accessibility improvements and keyboard navigation.

Run instructions (quick):
1. Create a React app (Vite recommended):
   npm create vite@latest healthguard --template react
   cd healthguard
2. Install Tailwind (optional for styling), Recharts and Framer Motion:
   npm install recharts framer-motion
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   Configure tailwind and import index.css
3. Replace src/App.jsx with this file's contents and run `npm run dev`.

Notes about the fix:
- The previous file was truncated and caused a syntax error. This rewrite completes
  every component and fixes fragile ID usage by using stable keys for menu items.
- COLORS constant is module-scoped so child components can use it.
*/

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

// Module-level constants
const COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
const MENU_KEYS = ["dashboard", "report", "water", "ai", "alerts"];

const TRANSLATIONS = {
  en: {
    dashboard: "Dashboard",
    report: "Report Case",
    water: "Water Quality",
    ai: "AI Predictions",
    alerts: "Alerts",
    submit: "Submit",
    goOffline: "Go Offline",
    goOnline: "Go Online",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    report: "केस दर्ज करें",
    water: "जल गुणवत्ता",
    ai: "एआई पूर्वानुमान",
    alerts: "चेतावनियां",
    submit: "जमा करें",
    goOffline: "ऑफ़लाइन जाएँ",
    goOnline: "ऑनलाइन जाएँ",
  },
  as: {
    dashboard: "ডেশ্বাৰ্ড",
    report: "মামলা দাখিল কৰক",
    water: "পানীৰ গুণগত মান",
    ai: "এআই পূৰ্বাভাস",
    alerts: "সতৰ্কবাৰ্তা",
    submit: "জমা কৰক",
    goOffline: "অফলাইন হওক",
    goOnline: "অনলাইন হওক",
  },
};

export default function HealthGuardAIDashboard() {
  // Basic stats
  const stats = {
    systemStatus: "Operational",
    aiAccuracy: "92.3%",
    communities: 15,
    activeUsers: 180,
  };

  // App state
  const [lang, setLang] = useState("en");
  const t = TRANSLATIONS[lang];

  const [activePage, setActivePage] = useState("dashboard"); // use keys from MENU_KEYS
  const [offline, setOffline] = useState(false);

  // Alerts
  const [alerts, setAlerts] = useState([
    { id: 1, type: "critical", message: "Village Well A — High bacteria", time: "2 min ago" },
    { id: 2, type: "warning", message: "Predicted outbreak — Zone 3", time: "3 hours ago" },
    { id: 3, type: "info", message: "Sensor offline — Tank 7", time: "1 day ago" },
  ]);

  // Case reports and queued offline reports
  const [caseReports, setCaseReports] = useState([]);
  const [queuedReports, setQueuedReports] = useState([]);

  // Water quality simulation
  const [waterData, setWaterData] = useState([]);

  // AI prediction mock
  const aiData = [
    { day: "Monsoon 1", actual: 12, predicted: 15 },
    { day: "Monsoon 2", actual: 18, predicted: 20 },
    { day: "Monsoon 3", actual: 9, predicted: 8 },
    { day: "Monsoon 4", actual: 14, predicted: 16 },
  ];

  // Trends mock
  const trendData = [
    { name: "Day 1", cases: 12 },
    { name: "Day 5", cases: 18 },
    { name: "Day 10", cases: 9 },
    { name: "Day 15", cases: 14 },
    { name: "Day 20", cases: 7 },
    { name: "Day 25", cases: 11 },
    { name: "Day 30", cases: 6 },
  ];

  // Pie data (alerts breakdown)
  const pieData = [
    { name: "Water Contamination", value: 40 },
    { name: "Predicted Outbreaks", value: 30 },
    { name: "Sensor Issues", value: 20 },
    { name: "Misc", value: 10 },
  ];

  // Refs for keyboard nav
  const navRefs = useRef({});

  useEffect(() => {
    // keep a small simulated water-sensor stream
    const iv = setInterval(() => {
      const pH = parseFloat((6 + Math.random() * 2).toFixed(2));
      const turbidity = parseFloat((1 + Math.random() * 5).toFixed(2));
      const bacteria = Math.floor(Math.random() * 250);
      const newEntry = { time: new Date().toLocaleTimeString(), pH, turbidity, bacteria };
      setWaterData((prev) => [...prev.slice(-19), newEntry]);
      if (bacteria > 150) {
        setAlerts((prev) => [
          { id: Date.now(), type: "critical", message: `High bacteria detected (${bacteria})`, time: "just now" },
          ...prev,
        ]);
      }
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    // When we come online, flush queued reports
    if (!offline && queuedReports.length > 0) {
      setCaseReports((prev) => [...queuedReports, ...prev]);
      setQueuedReports([]);
      setAlerts((prev) => [
        { id: Date.now(), type: "info", message: `${queuedReports.length} queued reports synced`, time: "just now" },
        ...prev,
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offline]);

  function handleCaseSubmit(report) {
    if (offline) {
      setQueuedReports((q) => [report, ...q]);
      setAlerts((prev) => [
        { id: Date.now(), type: "info", message: `Report queued (offline)`, time: "just now" },
        ...prev,
      ]);
    } else {
      setCaseReports((prev) => [report, ...prev]);
      setAlerts((prev) => [
        { id: Date.now(), type: "warning", message: `New case reported: ${report.symptoms}`, time: "just now" },
        ...prev,
      ]);
    }
  }

  function handleNavKey(e, index) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (index + 1) % MENU_KEYS.length;
      const id = `nav-${MENU_KEYS[nextIndex]}`;
      const el = navRefs.current[id];
      if (el) el.focus();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (index - 1 + MENU_KEYS.length) % MENU_KEYS.length;
      const id = `nav-${MENU_KEYS[prevIndex]}`;
      const el = navRefs.current[id];
      if (el) el.focus();
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-rose-50 to-amber-50 text-gray-800">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white p-2 rounded-md shadow-md">
        Skip to main content
      </a>

      {/* top banner with offline toggle */}
      <div className="max-w-[1400px] mx-auto p-6">
        <div className="flex items-center justify-end gap-3 mb-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={offline}
              onChange={() => setOffline((v) => !v)}
            />
            {offline ? t.goOnline : t.goOffline}
          </label>
        </div>
      </div>

      {offline && <div className="max-w-[1400px] mx-auto px-6"><div className="bg-amber-200 p-2 text-center rounded-md">📡 Offline – reports will be queued and sync when online</div></div>}

      <div className="max-w-[1400px] mx-auto p-6 grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-3 bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-md h-[90vh] sticky top-6" aria-label="Main navigation">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-600 text-white rounded-lg w-12 h-12 flex items-center justify-center font-bold">HG</div>
            <div>
              <div className="font-bold text-lg">HealthGuard AI</div>
              <div className="text-sm text-gray-600">Smart Surveillance Platform</div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <InfoRow label="System Status" value={stats.systemStatus} valueClass="text-green-600" />
            <InfoRow label="AI Accuracy" value={stats.aiAccuracy} />
            <InfoRow label="Coverage" value={`${stats.communities} Communities`} />
          </div>

          <select className="w-full p-2 rounded-md border mb-4" value={lang} onChange={(e) => setLang(e.target.value)} aria-label="Language select">
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="as">অসমীয়া</option>
          </select>

          <nav className="mt-4 space-y-2" role="navigation" aria-label="Sidebar menu">
            {MENU_KEYS.map((key, i) => (
              <NavItem
                key={key}
                id={`nav-${key}`}
                refCallback={(el) => (navRefs.current[`nav-${key}`] = el)}
                label={TRANSLATIONS[lang][key]}
                active={activePage === key}
                badge={key === "alerts" ? alerts.length : undefined}
                onClick={() => setActivePage(key)}
                onKeyDown={(e) => handleNavKey(e, i)}
              />
            ))}
          </nav>

          <div className="mt-6 text-xs text-gray-500">© HealthGuard AI • For SIH Hackathon</div>
        </aside>

        {/* Main content */}
        <main id="main-content" className="col-span-9" tabIndex={-1}>
          {activePage === "dashboard" && (
            <DashboardView stats={stats} alerts={alerts} trendData={trendData} pieData={pieData} />
          )}

          {activePage === "report" && (
            <ReportCaseForm
              onSubmit={(r) => handleCaseSubmit(r)}
              reports={caseReports}
              queued={queuedReports}
              submitLabel={t.submit}
            />
          )}

          {activePage === "water" && <WaterQualityPage data={waterData} />}

          {activePage === "ai" && <AIPredictionPage data={aiData} />}

          {activePage === "alerts" && <AlertsPage alerts={alerts} setAlerts={setAlerts} />}
        </main>
      </div>

      {/* aria-live region for announcements */}
      <div aria-live="polite" className="sr-only">
        {alerts.length > 0 ? `${alerts[0].message}` : "No alerts"}
      </div>
    </div>
  );
}

/* ------------------ Subcomponents ------------------ */

function ReportCaseForm({ onSubmit, reports = [], queued = [], submitLabel = "Submit" }) {
  const [form, setForm] = useState({ name: "", age: "", symptoms: "", location: "", reporter: "" });

  function handleSubmit() {
    if (!form.name || !form.symptoms) {
      alert("Please provide at least a name and symptoms.");
      return;
    }
    const payload = { ...form, id: Date.now(), time: new Date().toLocaleString() };
    onSubmit(payload);
    setForm({ name: "", age: "", symptoms: "", location: "", reporter: "" });
  }

  return (
    <div className="card p-6">
      <h2 className="font-bold mb-4">📋 Report Case</h2>
      <div className="grid gap-3 mb-4">
        <input className="border p-2 rounded-md" placeholder="Patient name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="border p-2 rounded-md" placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
        <input className="border p-2 rounded-md" placeholder="Symptoms" value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: e.target.value })} />
        <input className="border p-2 rounded-md" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <input className="border p-2 rounded-md" placeholder="Reported by" value={form.reporter} onChange={(e) => setForm({ ...form, reporter: e.target.value })} />
      </div>

      <div className="flex items-center gap-3">
        <button onClick={handleSubmit} className="px-4 py-2 bg-rose-600 text-white rounded-md">{submitLabel}</button>
      </div>

      <h3 className="font-semibold mt-6">Submitted Reports</h3>
      <ul className="space-y-2 text-sm mt-2">
        {reports.length === 0 && <li className="text-gray-500">No reports yet.</li>}
        {reports.map((r) => (
          <li key={r.id} className="border p-2 rounded-md">
            <div><b>{r.name}</b> <span className="text-xs text-gray-500">{r.time}</span></div>
            <div className="text-sm">{r.symptoms} — {r.location} (reported by {r.reporter})</div>
          </li>
        ))}
      </ul>

      {queued.length > 0 && (
        <div className="mt-4 text-amber-600">
          {queued.length} reports queued for sync when online.
        </div>
      )}
    </div>
  );
}

function WaterQualityPage({ data = [] }) {
  return (
    <div className="card p-6">
      <h2 className="font-bold mb-4">💧 Water Quality Monitoring</h2>
      {data.length === 0 ? (
        <div className="text-gray-500">Waiting for sensor data...</div>
      ) : (
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="pH" stroke="#3b82f6" dot={false} />
              <Line type="monotone" dataKey="turbidity" stroke="#f59e0b" dot={false} />
              <Line type="monotone" dataKey="bacteria" stroke="#ef4444" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function AIPredictionPage({ data = [] }) {
  const avgPred = data.reduce((s, d) => s + (d.predicted || 0), 0) / Math.max(1, data.length);
  const risk = avgPred > 15 ? "High" : avgPred > 10 ? "Medium" : "Low";
  return (
    <div className="card p-6">
      <h2 className="font-bold mb-4">🤖 AI Predictions</h2>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="actual" fill="#3b82f6" />
          <Bar dataKey="predicted" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4">
        <span className="font-semibold">Risk Level: </span>
        <span className={risk === "High" ? "text-red-600" : risk === "Medium" ? "text-amber-600" : "text-green-600"}>{risk}</span>
      </div>
    </div>
  );
}

function AlertsPage({ alerts = [], setAlerts }) {
  return (
    <div className="card p-6">
      <h2 className="font-bold mb-4">🚨 Alerts</h2>
      {alerts.length === 0 && <div className="text-gray-500">No alerts</div>}
      <ul className="space-y-3" aria-live="polite">
        {alerts.map((a) => (
          <li key={a.id} className="flex items-start gap-3">
            <span className={`mt-1 ${a.type === "critical" ? "text-red-500" : a.type === "warning" ? "text-amber-500" : "text-blue-500"}`}>●</span>
            <div className="flex-1">
              <div className="font-medium">{a.message}</div>
              <div className="text-xs text-gray-400">{a.time}</div>
            </div>
            <button
              onClick={() => setAlerts((prev) => prev.filter((al) => al.id !== a.id))}
              className="ml-auto text-xs text-gray-500 underline"
            >
              Dismiss
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Reusable small components */
function DashboardView({ stats = {}, alerts = [], trendData = [], pieData = [] }) {
  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <div className="text-3xl font-extrabold text-rose-600">HealthGuard AI</div>
          <div className="text-sm text-gray-500">Next-Gen Disease Surveillance & Prevention</div>
          <div className="mt-4 flex gap-6 text-sm text-gray-600">
            <span>🌐 {stats.communities} Communities</span>
            <span>👥 {stats.activeUsers} Active Users</span>
            <span>⚡ Real-time Monitoring</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-200">System Operational</button>
          <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full border border-blue-200">AI Active</button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg shadow">Alerts ({alerts.length})</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card red p-6 bg-red-50 rounded-xl">
          <h3 className="font-semibold text-red-700">Critical Water Contamination</h3>
          <p className="text-sm text-gray-600 mt-2">AI detected severe contamination in Village Well A. 850+ bacteria count detected.</p>
          <div className="mt-4 flex gap-3">
            <button className="px-3 py-2 bg-red-600 text-white rounded-md">Deploy Response Team</button>
            <button className="px-3 py-2 bg-white border rounded-md">View Analytics</button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card amber p-6 bg-amber-50 rounded-xl">
          <h3 className="font-semibold text-amber-800">Outbreak Prevention Success</h3>
          <p className="text-sm text-gray-600 mt-2">AI predictions prevented 28 potential cases this month through early intervention.</p>
          <div className="mt-4">
            <button className="px-3 py-2 bg-amber-600 text-white rounded-md">View Success Metrics</button>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-4 gap-6 mt-6">
        <StatCard title="Active Cases" value="12" icon="👥" />
        <StatCard title="Water Sources" value="46" icon="💧" />
        <StatCard title="AI Accuracy" value={stats.aiAccuracy} icon="🧠" />
        <StatCard title="Prevention Rate" value="84%" icon="🛡️" />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="col-span-2 card p-6 bg-white rounded-xl" role="region" aria-labelledby="community-trends">
          <div className="flex justify-between items-center mb-4">
            <div id="community-trends" className="font-semibold">Community Trends</div>
            <div className="text-sm text-gray-500">Last 30 days</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cases" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6 bg-white rounded-xl" role="region" aria-labelledby="alerts-breakdown">
          <div id="alerts-breakdown" className="font-semibold mb-3">Alerts Breakdown</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card mt-6 p-6 bg-white rounded-xl" role="region" aria-labelledby="recent-alerts">
        <div id="recent-alerts" className="font-semibold mb-3">Recent Alerts</div>
        <ul className="space-y-3 text-sm text-gray-600" aria-live="polite">
          {alerts.map((a) => (
            <li key={a.id} className="flex items-start gap-3">
              <div className={`mt-1 ${a.type === "critical" ? "text-red-500" : a.type === "warning" ? "text-amber-500" : "text-blue-500"}`}>●</div>
              <div>
                <div className="font-medium">{a.message}</div>
                <div className="text-xs text-gray-400">{a.time}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function InfoRow({ label, value, valueClass = "" }) {
  return (
    <div className="flex items-center justify-between text-sm text-gray-600">
      <div>{label}</div>
      <div className={`font-semibold ${valueClass}`}>{value}</div>
    </div>
  );
}

function NavItem({ id, label, active = false, badge, onClick, onKeyDown, refCallback }) {
  return (
    <button
      id={id}
      ref={(el) => refCallback && refCallback(el)}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={`flex items-center gap-3 p-3 w-full text-left rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 ${
        active ? "bg-red-600 text-white shadow-md" : "text-gray-700 hover:bg-gray-100"
      }`}
      aria-current={active ? "page" : undefined}
    >
      <span className="w-8 h-8 bg-white/30 rounded-md flex items-center justify-center" aria-hidden>
        📊
      </span>
      <span className="flex-1">{label}</span>
      {badge ? <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full">{badge}</span> : null}
    </button>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-xl font-semibold mt-1">{value}</div>
      </div>
      <div className="text-3xl" aria-hidden>
        {icon}
      </div>
    </div>
  );
}
