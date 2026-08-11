"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Save,
  Loader2,
  CheckCircle,
  Database,
  Send,
  Lock,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApiSettings } from "@/hooks/use-api-settings";
import { Toast } from "@/components/ui/toast";
import { CustomCategoryForm } from "./custom-category-form";

export function ApiSettingsForm() {
  const { settings, isLoaded, saveSettings } = useApiSettings();

  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [dopigoToken, setDopigoToken] = useState("");

  const [showSecret, setShowSecret] = useState(false);
  const [showToken, setShowToken] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      setClientId(settings.ideaSoftClientId);
      setClientSecret(settings.ideaSoftClientSecret);
      setDopigoToken(settings.dopigoApiToken);
    }
  }, [isLoaded, settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const success = await saveSettings({
      ideaSoftClientId: clientId,
      ideaSoftClientSecret: clientSecret,
      dopigoApiToken: dopigoToken,
    });

    setIsSaving(false);

    if (success) {
      setShowToast(true);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0066CC] p-6 sm:p-8 rounded-2xl text-white shadow-sm">
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-white/20 text-white border-white/30 gap-1.5">
              <Lock className="h-3 w-3" /> Güvenli Entegrasyon & KDV Yapılandırması
            </Badge>
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Sistem API Ayarları & Özel Kategori Yönetimi
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm max-w-lg leading-relaxed font-normal">
            IdeaSoft ve Dopigo servislerine kapalı devre erişim sağlayan API kimlik doğrulamalarını ve özel KDV kategorilerini buradan yönetin.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* IdeaSoft API Credentials Card */}
        <Card>
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-[#0066CC] border border-blue-100">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold tracking-tight text-gray-900">IdeaSoft API Kimlik Bilgileri</CardTitle>
                  <CardDescription>
                    IdeaSoft sipariş API&apos;sine erişim için gerekli OAuth token anahtarları
                  </CardDescription>
                </div>
              </div>
              <Badge variant="success" className="gap-1.5 hidden sm:flex">
                <CheckCircle className="h-3.5 w-3.5" /> Bağlantı Aktif
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            {/* Client ID Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
                IdeaSoft Client ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="ideasoft_live_..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0066CC] text-xs font-mono"
                />
              </div>
            </div>

            {/* Client Secret Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
                IdeaSoft Client Secret
              </label>
              <div className="relative">
                <input
                  type={showSecret ? "text" : "password"}
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder="sec_live_..."
                  required
                  className="w-full pl-4 pr-12 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0066CC] text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1.5 transition-colors cursor-pointer"
                >
                  {showSecret ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dopigo API Token Card */}
        <Card>
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold tracking-tight text-gray-900">Dopigo API Yapılandırması</CardTitle>
                  <CardDescription>
                    Faturaların Dopigo entegratörüne aktarımı için yetkilendirme anahtarı
                  </CardDescription>
                </div>
              </div>
              <Badge variant="success" className="gap-1.5 hidden sm:flex">
                <CheckCircle className="h-3.5 w-3.5" /> Bağlantı Aktif
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
                Dopigo API Token
              </label>
              <div className="relative">
                <input
                  type={showToken ? "text" : "password"}
                  value={dopigoToken}
                  onChange={(e) => setDopigoToken(e.target.value)}
                  placeholder="dop_live_..."
                  required
                  className="w-full pl-4 pr-12 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0066CC] text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1.5 transition-colors cursor-pointer"
                >
                  {showToken ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50/50 border-t border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Tüm API anahtarları SSL şifreleme ile muhafaza edilir.</span>
            </div>

            <Button
              type="submit"
              disabled={isSaving}
              variant="default"
              size="lg"
              className="w-full sm:w-auto min-w-[160px] gap-2 font-semibold"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Kaydet
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* Custom Category Zod Override Form */}
      <CustomCategoryForm />

      {showToast && (
        <Toast
          title="Ayarlar başarıyla kaydedildi"
          description="IdeaSoft ve Dopigo API kimlik bilgileriniz başarıyla güncellendi."
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
