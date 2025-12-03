"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

type Locale = "fr" | "en" | "ar";

function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function AdminPage({ params }: { params: { locale: Locale } }) {
  const locale = params.locale;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const [authorized, setAuthorized] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title_fr: "",
    title_en: "",
    title_ar: "",
    desc_fr: "",
    desc_en: "",
    desc_ar: "",
    accessType: "PREMIUM",
    duration: 0,
    thumbnail: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    const payload = token ? parseJwt(token) : null;
    const role = payload?.role || payload?.Role || payload?.roles || "";
    if (token && role === "ADMIN") {
      setAuthorized(true);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      loadCourses();
    } else {
      setAuthorized(false);
      window.location.href = `/${locale}`;
    }
  }, [locale]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/courses`);
      setCourses(Array.isArray(res.data) ? res.data : []);
    } finally {
      setLoading(false);
    }
  };

  const addCourse = async () => {
    const data = {
      title: { fr: form.title_fr, en: form.title_en, ar: form.title_ar },
      description: { fr: form.desc_fr, en: form.desc_en, ar: form.desc_ar },
      accessType: form.accessType,
      thumbnail: form.thumbnail || "https://windevexpert.online/favicon.svg",
      published: true,
      sections: { create: [] },
    };
    await axios.post(`${API_URL}/api/courses`, data);
    await loadCourses();
    setForm({
      title_fr: "",
      title_en: "",
      title_ar: "",
      desc_fr: "",
      desc_en: "",
      desc_ar: "",
      accessType: "PREMIUM",
      duration: 0,
      thumbnail: "",
    });
  };

  if (!authorized) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Administration des cours</h1>
        <button
          className="px-4 py-2 rounded bg-slate-100 border border-slate-300 hover:bg-slate-200"
          onClick={loadCourses}
        >
          Rafraîchir
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Catalogue</h2>
              {loading && <span className="text-sm text-slate-500">Chargement…</span>}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="p-2">Titre (FR)</th>
                    <th className="p-2">Publié</th>
                    <th className="p-2">Accès</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => (
                    <tr key={c.id} className="border-b">
                      <td className="p-2">{c?.title?.fr ?? String(c?.title ?? "")}</td>
                      <td className="p-2">{String(c?.published ?? false)}</td>
                      <td className="p-2">{c?.accessType ?? "PREMIUM"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-xl border border-slate-200 p-4 bg-white">
            <h2 className="font-semibold mb-3">Ajouter un cours</h2>
            <div className="space-y-2">
              <input className="w-full border rounded p-2" placeholder="Titre FR" value={form.title_fr} onChange={(e) => setForm({ ...form, title_fr: e.target.value })} />
              <input className="w-full border rounded p-2" placeholder="Titre EN" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} />
              <input className="w-full border rounded p-2" placeholder="Titre AR" value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} />
              <textarea className="w-full border rounded p-2" placeholder="Description FR" value={form.desc_fr} onChange={(e) => setForm({ ...form, desc_fr: e.target.value })} />
              <textarea className="w-full border rounded p-2" placeholder="Description EN" value={form.desc_en} onChange={(e) => setForm({ ...form, desc_en: e.target.value })} />
              <textarea className="w-full border rounded p-2" placeholder="Description AR" value={form.desc_ar} onChange={(e) => setForm({ ...form, desc_ar: e.target.value })} />
              <select className="w-full border rounded p-2" value={form.accessType} onChange={(e) => setForm({ ...form, accessType: e.target.value })}>
                <option value="FREE">FREE</option>
                <option value="SUBSCRIPTION">SUBSCRIPTION</option>
                <option value="PREMIUM">PREMIUM</option>
              </select>
              <input className="w-full border rounded p-2" placeholder="Thumbnail URL" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} />
              <button className="w-full bg-blue-600 text-white rounded p-2" onClick={addCourse}>Créer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

