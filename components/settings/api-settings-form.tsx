"use client";

import React, { useState, useEffect } from "react";
import {
  Key,
  ShieldCheck,
  Eye,
  EyeOff,
  Save,
  Loader2,
  CheckCircle,
  Database,
  Send,
  Lock,
  Sparkles,
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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900/90 via-indigo-950/80 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-white/10 relative overflow-hidden backdrop-blur-2xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-blue-500/20 text-blue-300 border-blue-400/30 gap-1.5">
              <Lock className="h-3 w-3" /> Güvenli Entegrasyon
            </Badge>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            API Bağlantı Ayarları
          </h2>
          <p className="text-slate-300 text-sm max-w-lg leading-relaxed">
            IdeaSoft ve Dopigo servislerine kapalı devre erişim sağlayan API kimlik doğrulamalarını buradan yönetin.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* IdeaSoft API Credentials Card */}
        <Card className="rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                  <Database className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">IdeaSoft API Kimlik Bilgileri</CardTitle>
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
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                IdeaSoft Client ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="ideasoft_live_..."
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm font-mono transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                IdeaSoft Yönetim Paneli ➔ Uygulama Mağazası üzerinden edindiğiniz Client ID.
              </p>
            </div>

            {/* Client Secret Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                IdeaSoft Client Secret
              </label>
              <div className="relative">
                <input
                  type={showSecret ? "text" : "password"}
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder="sec_live_..."
                  required
                  className="w-full pl-4 pr-12 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm font-mono transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 transition-colors"
                >
                  {showSecret ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Gizli tutulmalıdır. Sunucu taraflı kapalı devre haberleşmede kullanılır.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Dopigo API Token Card */}
        <Card className="rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
                  <Send className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">Dopigo API Yapılandırması</CardTitle>
                  <CardDescription>
                    Faturaların Dopigo entegratörüne otomatik aktarımı için yetkilendirme anahtarı
                  </CardDescription>
                </div>
              </div>
              <Badge variant="success" className="gap-1.5 hidden sm:flex">
                <CheckCircle className="h-3.5 w-3.5" /> Bağlantı Aktif
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            {/* Dopigo Token Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                Dopigo API Token
              </label>
              <div className="relative">
                <input
                  type={showToken ? "text" : "password"}
                  value={dopigoToken}
                  onChange={(e) => setDopigoToken(e.target.value)}
                  placeholder="dop_live_..."
                  required
                  className="w-full pl-4 pr-12 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-sm font-mono transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 transition-colors"
                >
                  {showToken ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Dopigo Hesabım ➔ API Erişimi sekmesinden alınan sabit Bearer token.
              </p>
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800/80 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Tüm API anahtarları SSL şifreleme ile muhafaza edilir.</span>
            </div>

            <Button
              type="submit"
              disabled={isSaving}
              variant="apple"
              size="lg"
              className="w-full sm:w-auto min-w-[160px] gap-2"
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

      {/* Apple HIG Toast Alert */}
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
