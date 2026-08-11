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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#2c2c2e]/70 backdrop-blur-3xl p-6 sm:p-8 rounded-3xl text-white shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#0A84FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-[#0A84FF]/20 text-[#0A84FF] border-[#0A84FF]/30 gap-1.5">
              <Lock className="h-3 w-3" /> Güvenli Entegrasyon
            </Badge>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            API Bağlantı Ayarları
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-lg leading-relaxed font-medium">
            IdeaSoft ve Dopigo servislerine kapalı devre erişim sağlayan API kimlik doğrulamalarını buradan yönetin.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* IdeaSoft API Credentials Card */}
        <Card className="rounded-3xl border border-white/10 bg-[#2c2c2e]/60 backdrop-blur-2xl shadow-2xl overflow-hidden">
          <CardHeader className="border-b border-white/10 bg-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#0A84FF]/15 text-[#0A84FF] border border-[#0A84FF]/30">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base text-white">IdeaSoft API Kimlik Bilgileri</CardTitle>
                  <CardDescription className="text-zinc-400 text-xs">
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
              <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block">
                IdeaSoft Client ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="ideasoft_live_..."
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/50 focus:border-[#0A84FF] text-xs font-mono transition-all"
                />
              </div>
            </div>

            {/* Client Secret Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block">
                IdeaSoft Client Secret
              </label>
              <div className="relative">
                <input
                  type={showSecret ? "text" : "password"}
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder="sec_live_..."
                  required
                  className="w-full pl-4 pr-12 py-3 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/50 focus:border-[#0A84FF] text-xs font-mono transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1.5 transition-colors"
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
        <Card className="rounded-3xl border border-white/10 bg-[#2c2c2e]/60 backdrop-blur-2xl shadow-2xl overflow-hidden">
          <CardHeader className="border-b border-white/10 bg-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#BF5AF2]/15 text-[#BF5AF2] border border-[#BF5AF2]/30">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base text-white">Dopigo API Yapılandırması</CardTitle>
                  <CardDescription className="text-zinc-400 text-xs">
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
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block">
                Dopigo API Token
              </label>
              <div className="relative">
                <input
                  type={showToken ? "text" : "password"}
                  value={dopigoToken}
                  onChange={(e) => setDopigoToken(e.target.value)}
                  placeholder="dop_live_..."
                  required
                  className="w-full pl-4 pr-12 py-3 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/50 focus:border-[#0A84FF] text-xs font-mono transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1.5 transition-colors"
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
          <CardFooter className="bg-white/5 border-t border-white/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <ShieldCheck className="h-4 w-4 text-[#30D158]" />
              <span>Tüm API anahtarları SSL şifreleme ile muhafaza edilir.</span>
            </div>

            <Button
              type="submit"
              disabled={isSaving}
              variant="apple"
              size="lg"
              className="w-full sm:w-auto min-w-[160px] gap-2 font-bold"
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
