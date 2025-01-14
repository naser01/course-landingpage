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

const translations = {
  en: {
    title: "Transform Your Skills with Our Course",
    subtitle: "Learn at your own pace and unlock your potential",
    watchVideo: "Watch Course Preview",
    signUp: "Sign Up Now",
    fullName: "Full Name",
    email: "Email",
    submit: "Submit",
    formTitle: "Join Our Course",
    success: "Thank you for signing up!",
    error: "An error occurred. Please try again.",
    enterName: "Please enter your name",
    enterEmail: "Please enter a valid email",
    cancel: "Cancel",
  },
  ar: {
    title: "طور مهاراتك مع دورتنا",
    subtitle: "تعلم على وتيرتك الخاصة وأطلق العنان لإمكاناتك",
    watchVideo: "شاهد معاينة الدورة",
    signUp: "سجل الآن",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    submit: "إرسال",
    formTitle: "انضم إلى دورتنا",
    success: "شكراً لتسجيلك!",
    error: "حدث خطأ. يرجى المحاولة مرة أخرى.",
    enterName: "الرجاء إدخال اسمك",
    enterEmail: "الرجاء إدخال بريد إلكتروني صحيح",
    cancel: "إلغاء",
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={`landing-page ${isRTL ? "rtl" : ""}`}>
        <header className="landing-page__header">
          <div className="landing-page__header-content">
            <div className="landing-page__logo">Logo</div>
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

            <Typography component="h2" className="landing-page__subtitle">
              {t.subtitle}
            </Typography>

            <div className="landing-page__video">
              <PlayArrow className="landing-page__video-icon" />
              <Typography className="landing-page__video-text">
                {t.watchVideo}
              </Typography>
            </div>

            <Button
              variant="contained"
              onClick={() => setShowForm(true)}
              className="landing-page__signup"
            >
              {t.signUp}
            </Button>
          </div>

          <Dialog
            open={showForm}
            onClose={() => !loading && setShowForm(false)}
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
                    label={t.fullName}
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    disabled={loading}
                  />

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

                  <div className="landing-page__form-actions">
                    <Button
                      onClick={() => setShowForm(false)}
                      disabled={loading}
                    >
                      {t.cancel}
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="landing-page__loading">
                          <CircularProgress size={24} />
                        </div>
                      ) : (
                        t.submit
                      )}
                    </Button>
                  </div>
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
