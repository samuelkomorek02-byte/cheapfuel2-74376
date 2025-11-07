import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import LanguageMenu from "@/components/LanguageMenu";
import cheapfuelLogo from "@/assets/cheapfuel-logo.svg";
import { Session, User } from "@supabase/supabase-js";
import { useSubscription } from "@/hooks/useSubscription";
import Footer from "@/components/Footer";

// Validation schemas
const emailSchema = z.string().trim().email();
const passwordSchema = z.string().min(6);

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { subscribed, loading: subLoading, checkSubscription } = useSubscription();
  const [isSignUp, setIsSignUp] = useState(() => {
    // Check if we came from onboarding with signup mode
    const state = location.state as { mode?: string } | null;
    return state?.mode === 'signup';
  });
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  // Check authentication state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Redirect authenticated users
        if (session?.user && event === 'SIGNED_IN') {
          if (isSignUp) {
            // New user registration → always redirect to paywall
            setTimeout(() => {
              navigate("/paywall");
            }, 0);
          } else {
            // Existing user login → check subscription status
            await checkSubscription();
            // Wait briefly for subscription status to load
            setTimeout(async () => {
              const { data } = await supabase.functions.invoke("check-subscription", {
                headers: {
                  Authorization: `Bearer ${session.access_token}`,
                },
              });
              
              if (data?.subscribed) {
                navigate("/");
              } else {
                navigate("/paywall");
              }
            }, 500);
          }
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Check subscription for existing session
        const { data } = await supabase.functions.invoke("check-subscription", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        
        if (data?.subscribed) {
          navigate("/");
        } else {
          navigate("/paywall");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, isSignUp, checkSubscription]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate input
      const validatedEmail = emailSchema.parse(email);
      const validatedPassword = passwordSchema.parse(password);

      if (isSignUp) {
        // Sign up
        const { error } = await supabase.auth.signUp({
          email: validatedEmail,
          password: validatedPassword,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: t("auth_error_title"),
              description: t("auth_error_user_exists"),
              variant: "destructive"
            });
          } else {
            throw error;
          }
        } else {
          toast({
            title: t("auth_success_signup_title"),
            description: t("auth_success_signup_desc")
          });
        }
      } else {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email: validatedEmail,
          password: validatedPassword
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: t("auth_error_title"),
              description: t("auth_error_invalid_credentials"),
              variant: "destructive"
            });
          } else {
            throw error;
          }
        } else {
          toast({
            title: t("auth_success_login_title"),
            description: t("auth_success_login_desc")
          });
        }
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const issues = error.issues[0];
        if (issues.path[0] === "email") {
          toast({
            title: t("auth_error_title"),
            description: t("auth_error_invalid_email"),
            variant: "destructive"
          });
        } else if (issues.path[0] === "password") {
          toast({
            title: t("auth_error_title"),
            description: t("auth_error_weak_password"),
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: t("auth_error_title"),
          description: error.message,
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validatedEmail = emailSchema.parse(email);

      const { error } = await supabase.auth.resetPasswordForEmail(validatedEmail, {
        redirectTo: `${window.location.origin}/auth`
      });

      if (error) throw error;

      toast({
        title: t("auth_reset_link_sent"),
        description: t("auth_reset_link_sent_desc")
      });

      setIsForgotPassword(false);
      setEmail("");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: t("auth_error_title"),
          description: t("auth_error_invalid_email"),
          variant: "destructive"
        });
      } else {
        toast({
          title: t("auth_error_title"),
          description: error.message,
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={cheapfuelLogo} alt="CheapFuel Logo" className="h-8 w-8" />
            <h1 className="text-xl font-bold">CheapFuel</h1>
          </div>
          <LanguageMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {isForgotPassword ? t("auth_reset_password_title") : t("auth_title")}
            </CardTitle>
            <CardDescription className="text-center">
              {isForgotPassword ? t("auth_reset_password_subtitle") : t("auth_subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isForgotPassword ? (
              /* Password Reset Form */
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">{t("auth_email_placeholder")}</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder={t("auth_email_placeholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("auth_send_reset_link")}
                </Button>
                <Button
                  type="button"
                  variant="link"
                  className="w-full"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setEmail("");
                  }}
                  disabled={loading}
                >
                  {t("auth_back_to_login")}
                </Button>
              </form>
            ) : (
              /* Email/Password Form */
              <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("auth_email_placeholder")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("auth_email_placeholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth_password_placeholder")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("auth_password_placeholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSignUp ? t("auth_sign_up") : t("auth_sign_in")}
                </Button>
              </form>
            )}

            {!isForgotPassword && (
              <>
                {/* Forgot Password Link */}
                {!isSignUp && (
                  <div className="text-center">
                    <Button
                      variant="link"
                      className="p-0 h-auto text-sm"
                      onClick={() => setIsForgotPassword(true)}
                      disabled={loading}
                    >
                      {t("auth_forgot_password")}
                    </Button>
                  </div>
                )}

                {/* Toggle Sign In/Up */}
                <div className="text-center text-sm">
                  <span className="text-muted-foreground">
                    {isSignUp ? t("auth_have_account") : t("auth_no_account")}
                  </span>{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-semibold"
                    onClick={() => setIsSignUp(!isSignUp)}
                    disabled={loading}
                  >
                    {isSignUp ? t("auth_switch_to_login") : t("auth_switch_to_signup")}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
