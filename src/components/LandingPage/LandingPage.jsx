import React, { useState } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogContent,
  TextField,
  Box,
  IconButton,
  CircularProgress,
  Alert,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import { Language, PlayArrow } from "@mui/icons-material";
import "./LandingPage.css";
import logo from "./logo1.png";

const translations = {
  en: {
    title:
      "Get Notified When Our Google Search Ads Course in Arabic is Live! 📧",
    subtitle:
      "Are you ready to take your Google Search Ads skills to the next level? Our Google Search Ads Course will soon be available in Arabic, designed specifically for Arabic-speaking entrepreneurs and marketers!",
    mainCta:
      "Be the first to know when the course is available for purchase and start learning powerful Google Search Ads strategies in your language — with easy-to-follow, step-by-step guidance.",
    benefitsTitle: "Why Join the Waitlist?",
    benefits: [
      "🔥 The course will be available in Arabic, making it easier for you to learn and apply the strategies to your business.",
      "🚀 Get early access and special discounts when the course launches.",
      "🎯 Master Google Search Ads with proven techniques that will boost your campaigns and drive results.",
    ],
    callToAction:
      "Don't miss out! Sign up now to be among the first to access the course in Arabic and unlock the full potential of Google Search Ads.",
    emailPrompt: "Enter Your Email to Get Notified First!",
    email: "Email Address",
    submit: "Notify Me",
    formTitle: "Join The Waitlist",
    success: "Thank you for joining the waitlist!",
    error: "An error occurred. Please try again.",
    spam: "No spam, we promise. Only valuable course updates and offers.",
  },
  ar: {
    title: "احصل على إشعار عند توافر دورة إعلانات جوجل باللغة العربية! 📧",
    subtitle:
      "هل أنت مستعد للارتقاء بمهاراتك في إعلانات جوجل؟ دورة إعلانات جوجل الخاصة بنا ستكون متاحة قريبًا باللغة العربية، تم تصميمها خصيصًا لأصحاب الأعمال والمسوقين الناطقين بالعربية!",
    mainCta:
      "كن أول من يعرف عندما تصبح الدورة متاحة للشراء وابدأ في تعلم استراتيجيات إعلانات جوجل الفعّالة بلغتك الأم — مع دليل سهل وواضح خطوة بخطوة.",
    benefitsTitle: "لماذا يجب أن تنضم إلى قائمة الانتظار؟",
    benefits: [
      "🔥 الدورة ستكون باللغة العربية، مما يسهل عليك تعلم وتطبيق الاستراتيجيات على عملك.",
      "🚀 احصل على الوصول المبكر وخصومات خاصة عند إطلاق الدورة.",
      "🎯 تعلم استراتيجيات فعّالة لإعلانات جوجل تساعدك في تحسين حملاتك وتحقيق نتائج حقيقية.",
    ],
    callToAction:
      "!لا تفوت الفرصة! اشترك الآن لتكون من أول من يحصل على الدورة باللغة العربية وتكتشف كيفية الاستفادة القصوى من إعلانات جوجل",
    emailPrompt: "!أدخل بريدك الإلكتروني للحصول على إشعار عند الإطلاق",
    email: "البريد الإلكتروني",
    submit: "أشعرني",
    formTitle: "انضم إلى قائمة الانتظار",
    success: "!شكراً لانضمامك إلى قائمة الانتظار",
    error: "حدث خطأ. يرجى المحاولة مرة أخرى.",
    spam: "لا يوجد رسائل غير مرغوب فيها، نعدك بذلك. فقط تحديثات وعروض الدورة القيمة.",
  },
};

// Mailchimp configuration
const MAILCHIMP_API_KEY = "your-api-key";
const MAILCHIMP_LIST_ID = "your-list-id";
const MAILCHIMP_API_SERVER = "your-server";

const LandingPage = () => {
  const [language, setLanguage] = useState("en");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "" });
  const [status, setStatus] = useState({ success: false, error: null });
  const [loading, setLoading] = useState(false);

  const t = translations[language];
  const isRTL = language === "ar";

  const theme = createTheme({
    direction: isRTL ? "rtl" : "ltr",
  });

  const subscribeToMailchimp = async (email, fullName) => {
    try {
      const response = await fetch(
        `https://${MAILCHIMP_API_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
        {
          method: "POST",
          headers: {
            Authorization: `apikey ${MAILCHIMP_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email_address: email,
            status: "subscribed",
            merge_fields: {
              FNAME: fullName.split(" ")[0],
              LNAME: fullName.split(" ").slice(1).join(" "),
            },
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Subscription failed");
      return data;
    } catch (error) {
      throw new Error(error.message || "Subscription failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ success: false, error: null });

    try {
      await subscribeToMailchimp(formData.email, formData.fullName);
      setStatus({ success: true, error: null });
      setTimeout(() => {
        setShowForm(false);
        setStatus({ success: false, error: null });
        setFormData({ fullName: "", email: "" });
      }, 2000);
    } catch (error) {
      setStatus({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider
      theme={createTheme({
        direction: isRTL ? "rtl" : "ltr",
        palette: {
          primary: {
            main: "#004aad",
          },
          secondary: {
            main: "#f8d74f",
          },
        },
      })}
    >
      <CssBaseline />
      <div className={`landing-page ${isRTL ? "rtl" : ""}`}>
        <header className="landing-page__header">
          <div className="landing-page__header-content">
            <div className="landing-page__logo">
              <img className="logo_size" src={logo} alt="logo" />
            </div>
            <IconButton
              className="landing-page__language-button"
              onClick={() =>
                setLanguage((lang) => (lang === "en" ? "ar" : "en"))
              }
            >
              <Language />
            </IconButton>
          </div>
        </header>

        <main className="landing-page__main">
          <div className="landing-page__main-content">
            <Typography component="h1" className="landing-page__title">
              {t.title}
            </Typography>

            <Typography className="landing-page__subtitle">
              {t.subtitle}
            </Typography>
            <div className="landing-page__video">
              <PlayArrow className="landing-page__video-icon" />
              <Typography className="landing-page__video-text">
                {t.watchVideo}
              </Typography>
            </div>
            <Typography className="landing-page__main-cta">
              {t.mainCta}
            </Typography>

            <div className="landing-page__benefits">
              <Typography
                component="h2"
                className="landing-page__benefits-title"
              >
                {t.benefitsTitle}
              </Typography>
              <div className="landing-page__benefits-list">
                {t.benefits.map((benefit, index) => (
                  <Typography
                    key={index}
                    className="landing-page__benefit-item"
                  >
                    {benefit}
                  </Typography>
                ))}
              </div>
            </div>

            <Typography className="landing-page__call-to-action">
              {t.callToAction}
            </Typography>

            <Button
              variant="contained"
              onClick={() => setShowForm(true)}
              className="landing-page__signup"
            >
              {t.emailPrompt}
            </Button>

            <Typography className="landing-page__spam-notice">
              {t.spam}
            </Typography>
          </div>

          <Dialog
            open={showForm}
            onClose={() => !loading && setShowForm(false)}
            className="landing-page__dialog"
          >
            <DialogContent className="landing-page__form">
              {status.success ? (
                <div className="landing-page__success">
                  <Alert severity="success">{t.success}</Alert>
                </div>
              ) : (
                <Box component="form" onSubmit={handleSubmit}>
                  <Typography className="landing-page__form-title">
                    {t.formTitle}
                  </Typography>

                  <TextField
                    className="landing-page__form-field"
                    label={t.email}
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    disabled={loading}
                  />

                  {status.error && (
                    <Alert severity="error" className="landing-page__error">
                      {t.error}
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    fullWidth
                    className="landing-page__submit"
                  >
                    {loading ? (
                      <div className="landing-page__loading">
                        <CircularProgress size={24} />
                      </div>
                    ) : (
                      t.submit
                    )}
                  </Button>
                </Box>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default LandingPage;
