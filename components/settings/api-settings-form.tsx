"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Save, Key, Loader2, CheckCircle2, ShieldAlert } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApiSettings } from "@/hooks/use-api-settings";
import { Toast } from "@/components/ui/toast";
import { CustomCategoryForm } from "./custom-category-form";

export function ApiSettingsForm() {
  const { settings, saveSettings, isLoaded } = useApiSettings();

  const [ideaSoftClientId, setIdeaSoftClientId] = useState(
    settings.ideaSoftClientId
  );
  const [ideaSoftClientSecret, setIdeaSoftClientSecret] = useState(
    settings.ideaSoftClientSecret
  );
  const [dopigoApiToken, setDopigoApiToken] = useState(
    settings.dopigoApiToken
  );

  const [showClientSecret, setShowClientSecret] = useState(false);
  const [showDopigoToken, setShowDopigoToken] = useState(false);

  const [isVerifying, setIsVerifying] = useState(false);
  const [toastInfo, setToastInfo] = useState<{
    title: string;
    description: string;
    type: "success" | "error";
  } | null>(null);

  React.useEffect(() => {
    if (isLoaded) {
      setIdeaSoftClientId(settings.ideaSoftClientId);
      setIdeaSoftClientSecret(settings.ideaSoftClientSecret);
      setDopigoApiToken(settings.dopigoApiToken);
    }
  }, [isLoaded, settings]);

  /**
   * Task 10: Real API Key Validation
   * Sends verification requests to /api/ideasoft/verify and /api/dopigo/verify
   * Only saves to localStorage if endpoints return 200 OK
   */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setToastInfo(null);

    try {
      // 1. Verify IdeaSoft API Key
      const ideaRes = await fetch("/api/ideasoft/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: ideaSoftClientId,
          clientSecret: ideaSoftClientSecret,
        }),
      });

      const ideaJson = await ideaRes.json().catch(() => ({}));
      if (!ideaRes.ok || !ideaJson.success) {
        setIsVerifying(false);
        setToastInfo({
          title: "Doğrulama Başarısız",
          description: ideaJson.error || "Doğrulama Başarısız: Girdiğiniz IdeaSoft API anahtarı geçersiz.",
          type: "error",
        });
        return;
      }

      // 2. Verify Dopigo API Token
      const dopRes = await fetch("/api/dopigo/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dopigoApiToken }),
      });

      const dopJson = await dopRes.json().catch(() => ({}));
      if (!dopRes.ok || !dopJson.success) {
        setIsVerifying(false);
        setToastInfo({
          title: "Doğrulama Başarısız",
          description: dopJson.error || "Doğrulama Başarısız: Girdiğiniz Dopigo API token'ı geçersiz.",
          type: "error",
        });
        return;
      }

      // 3. Credentials verified successfully -> Save to localStorage
      saveSettings({
        ideaSoftClientId,
        ideaSoftClientSecret,
        dopigoApiToken,
      });

      setIsVerifying(false);
      setToastInfo({
        title: "API Kimlik Bilgileri Doğrulandı",
        description: "IdeaSoft ve Dopigo API anahtarlarınız başarıyla doğrulandı ve kaydedildi.",
        type: "success",
      });
    } catch (err: any) {
      setIsVerifying(false);
      setToastInfo({
        title: "Doğrulama Başarısız",
        description: "Doğrulama Başarısız: Girdiğiniz API anahtarı geçersiz veya sunucuya ulaşılamadı.",
        type: "error",
      });
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-12 text-gray-500 gap-2">
        <Loader2 className="h-5 w-5 animate-spin text-[#0066CC]" />
        <span>Ayarlar yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-[#0066CC] border border-blue-100">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold tracking-tight text-gray-900">
                API Entegrasyon Ayarları (Canlı Doğrulamalı)
              </CardTitle>
              <CardDescription>
                IdeaSoft e-ticaret mağazası ve Dopigo e-Fatura entegrasyon anahtarlarınız
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* IdeaSoft Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                IdeaSoft API Kimlik Bilgileri
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    IdeaSoft Client ID
                  </label>
                  <input
                    type="text"
                    value={ideaSoftClientId}
                    onChange={(e) => setIdeaSoftClientId(e.target.value)}
                    placeholder="Örn: ideasoft_live_88492019"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#0066CC]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    IdeaSoft Client Secret
                  </label>
                  <div className="relative">
                    <input
                      type={showClientSecret ? "text" : "password"}
                      value={ideaSoftClientSecret}
                      onChange={(e) => setIdeaSoftClientSecret(e.target.value)}
                      placeholder="••••••••••••••••"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-white border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#0066CC]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowClientSecret(!showClientSecret)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showClientSecret ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Dopigo Section */}
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                Dopigo API Kimlik Bilgileri
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  Dopigo API Token
                </label>
                <div className="relative">
                  <input
                    type={showDopigoToken ? "text" : "password"}
                    value={dopigoApiToken}
                    onChange={(e) => setDopigoApiToken(e.target.value)}
                    placeholder="Örn: dop_live_tok_77281920384c901"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-white border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#0066CC]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowDopigoToken(!showDopigoToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showDopigoToken ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                disabled={isVerifying}
                variant="default"
                size="lg"
                className="gap-2 font-semibold"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    API Anahtarları Doğrulanıyor...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Doğrula ve Kaydet
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Custom Categories Form Section */}
      <CustomCategoryForm />

      {toastInfo && (
        <Toast
          title={toastInfo.title}
          description={toastInfo.description}
          type={toastInfo.type}
          onClose={() => setToastInfo(null)}
        />
      )}
    </div>
  );
}
