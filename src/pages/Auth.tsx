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
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import LanguageMenu from "@/components/LanguageMenu";
import cheapfuelLogo from "@/assets/cheapfuel-logo.svg";
import { Session, User } from "@supabase/supabase-js";
import { useSubscription } from "@/hooks/useSubscription";
import Footer from "@/components/Footer";
import { isPreviewMode } from "@/lib/utils";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    t
  } = useTranslation();
  const {
    subscribed,
    loading: subLoading,
    checkSubscription
  } = useSubscription();
  const [isSignUp, setIsSignUp] = useState(() => {
    // Check if we came from onboarding with signup mode
    const state = location.state as {
      mode?: string;
    } | null;
    return state?.mode === 'signup';
  });
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  
  // Password Reset States
  const [isPasswordUpdate, setIsPasswordUpdate] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordUpdateError, setPasswordUpdateError] = useState("");

  // Check for password recovery in URL (both query params and hash fragments)
  useEffect(() => {
    // Check both query params and hash fragments (Supabase uses hash fragments for auth tokens)
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    const type = searchParams.get('type') || hashParams.get('type');
    const accessToken = searchParams.get('access_token') || hashParams.get('access_token');
    
    console.log('Password reset detection:', { 
      type, 
      hasToken: !!accessToken,
      source: searchParams.get('type') ? 'query' : hashParams.get('type') ? 'hash' : 'none'
    });
    
    if (type === 'recovery' && accessToken) {
      console.log('Activating password update mode');
      setIsPasswordUpdate(true);
      setIsForgotPassword(false);
      setIsSignUp(false);
      
      // Show a toast to inform the user
      toast({
        title: t("auth_password_reset_ready_title"),
        description: t("auth_password_reset_ready_desc"),
      });
    }
  }, [t]);

  // Check authentication state
  useEffect(() => {
    let redirectTimeout: NodeJS.Timeout;
    let debounceTimeout: NodeJS.Timeout;
    let lastAuthEvent = { event: '', timestamp: 0 };
    let hasCheckedInitialSession = false;

    // Set up auth state listener FIRST with debouncing
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Debounce: Ignore rapid auth changes (max 1x per 500ms)
      const now = Date.now();
      if (event === lastAuthEvent.event && now - lastAuthEvent.timestamp < 500) {
        console.log('Debounced auth event:', event);
        return;
      }
      lastAuthEvent = { event, timestamp: now };

      setSession(session);
      setUser(session?.user ?? null);

      // Handle SIGNED_OUT with cleanup
      if (event === 'SIGNED_OUT') {
        // Explicit cleanup
        await supabase.auth.signOut({ scope: 'local' });
        localStorage.removeItem('supabase.auth.token');
        setSession(null);
        setUser(null);
        setRedirecting(false);
        return;
      }

      // Only handle SIGNED_IN event (actual login/signup action)
      // Don't redirect if we're in password update mode
      if (event === 'SIGNED_IN' && session?.user && !isPasswordUpdate) {
        // Prevent multiple redirects
        if (redirecting) return;
        
        setRedirecting(true);

        // Safety timeout - reset redirecting state after 8 seconds
        redirectTimeout = setTimeout(() => {
          setRedirecting(false);
        }, 8000);
        
        if (isSignUp) {
          // New user registration → store flag and redirect to paywall
          sessionStorage.setItem('welcomeNewUser', 'true');
          navigate("/paywall", { replace: true });
        } else {
          // Existing user login → check subscription status
          try {
            const {
              data
            } = await supabase.functions.invoke("check-subscription", {
              headers: {
                Authorization: `Bearer ${session.access_token}`
              }
            });
            if (data?.subscribed) {
              navigate("/aboseite", {
                state: {
                  subscribed: true,
                  checkedAt: Date.now()
                }
              });
            } else {
              navigate("/paywall");
            }
          } catch (error) {
            console.error("Subscription check error:", error);
            navigate("/paywall");
          }
        }
      }
    });

    // Check for existing session only once on mount
    if (!hasCheckedInitialSession) {
      hasCheckedInitialSession = true;
      supabase.auth.getSession().then(({
        data: {
          session
        }
      }) => {
        // Im Preview-Modus keine Redirects
        if (isPreviewMode()) return;
        
        // Don't redirect if we're in password update mode or if we're in signup mode
        // (user might be coming back from social links)
        if (session?.user && !isPasswordUpdate && !isSignUp) {
          // Only redirect if we haven't just navigated here
          const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (navigationEntry && navigationEntry.type !== 'back_forward') {
            navigate("/aboseite", {
              replace: true
            });
          }
        }
      });
    }
    
    return () => {
      subscription.unsubscribe();
      if (redirectTimeout) clearTimeout(redirectTimeout);
      if (debounceTimeout) clearTimeout(debounceTimeout);
    };
  }, [navigate, isSignUp, isPasswordUpdate, redirecting]);

  // Unified validation schema
  const authSchema = z.object({
    email: z.string().trim().email(),
    password: z.string().min(6)
  });

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPasswordError("");
    
    try {
      // Unified validation for both flows
      const validated = authSchema.parse({ email, password });
      
      if (isSignUp) {
        // Validate password confirmation
        if (password !== signupConfirmPassword) {
          setPasswordError(t("auth_passwords_mismatch"));
          setLoading(false);
          return;
        }
        
        // Sign up
        const {
          error
        } = await supabase.auth.signUp({
          email: validated.email,
          password: validated.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        if (error) {
          if (error.message.includes("already registered") || error.message.includes("User already registered")) {
            toast({
              title: t("auth_error_title"),
              description: t("auth_error_user_exists"),
              variant: "destructive",
              duration: 5000
            });
            setLoading(false);
            return;
          }
          throw error;
        }
      } else {
        // Sign in
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email: validated.email,
          password: validated.password
        });
        if (error) {
          setPasswordError(t("auth_error_invalid_credentials_inline"));
          setLoading(false);
          return;
        }
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const issue = error.issues[0];
        if (issue.path[0] === "email") {
          toast({
            title: t("auth_error_title"),
            description: t("auth_error_invalid_email"),
            variant: "destructive",
            duration: 5000
          });
        } else if (issue.path[0] === "password") {
          setPasswordError(isSignUp ? t("auth_password_too_short_inline") : t("auth_error_invalid_credentials_inline"));
        }
      } else {
        toast({
          title: t("auth_error_title"),
          description: error.message,
          variant: "destructive",
          duration: 5000
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
      const validatedEmail = z.string().trim().email().parse(email);
      const {
        error
      } = await supabase.auth.resetPasswordForEmail(validatedEmail, {
        redirectTo: `${window.location.origin}/auth`
      });
      if (error) throw error;
      toast({
        title: t("auth_reset_link_sent"),
        description: t("auth_reset_link_sent_desc"),
        duration: 5000
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

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPasswordUpdateError("");
    
    try {
      // Validate passwords
      if (newPassword.length < 6) {
        setPasswordUpdateError(t("auth_password_too_short_inline"));
        setLoading(false);
        return;
      }
      
      if (newPassword !== confirmPassword) {
        setPasswordUpdateError(t("auth_passwords_mismatch"));
        setLoading(false);
        return;
      }
      
      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      // Success
      toast({
        title: t("auth_password_updated_title"),
        description: t("auth_password_updated_desc"),
        duration: 5000
      });
      
      // Cleanup and redirect
      setIsPasswordUpdate(false);
      setNewPassword("");
      setConfirmPassword("");
      setPasswordUpdateError("");
      window.history.replaceState({}, document.title, "/auth");
      
    } catch (error: any) {
      toast({
        title: t("auth_error_title"),
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return <div className="min-h-screen bg-background flex flex-col">
      {/* Loading Overlay während Subscription-Check */}
      {redirecting && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Anmeldung wird verarbeitet...
            </p>
          </div>
        </div>}
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40 animate-fade-in">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          {/* Centered Logo and Text */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
            <img src={cheapfuelLogo} alt="Cheapfuel Logo" className="h-8 w-8" />
            <h1 className="text-xl font-bold">Cheapfuel</h1>
          </div>
          
          {/* Language Menu */}
          <LanguageMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {isPasswordUpdate ? t("auth_password_update_title") : (isForgotPassword ? t("auth_reset_password_title") : t("auth_title"))}
            </CardTitle>
            <CardDescription className="text-center">
              {isPasswordUpdate ? t("auth_password_update_subtitle") : (isForgotPassword ? t("auth_reset_password_subtitle") : (isSignUp ? t("auth_subtitle_signup") : t("auth_subtitle_login")))}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isPasswordUpdate ? (
              /* Password Update Form */
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">{t("auth_new_password_placeholder")}</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("auth_new_password_placeholder")}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setPasswordUpdateError("");
                      }}
                      required
                      disabled={loading}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={loading}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{t("auth_confirm_password_placeholder")}</Label>
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth_confirm_password_placeholder")}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordUpdateError("");
                    }}
                    required
                    disabled={loading}
                  />
                  {passwordUpdateError && (
                    <p className="text-sm text-red-500 mt-1">{passwordUpdateError}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("auth_update_password_button")}
                </Button>
              </form>
            ) : isForgotPassword ? (/* Password Reset Form */
          <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">{t("auth_email_placeholder")}</Label>
                  <Input id="reset-email" type="email" placeholder={t("auth_email_placeholder")} value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("auth_send_reset_link")}
                </Button>
                <Button type="button" variant="link" className="w-full" onClick={() => {
              setIsForgotPassword(false);
              setEmail("");
            }} disabled={loading}>
                  {t("auth_back_to_login")}
                </Button>
              </form>) : (/* Email/Password Form */
          <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("auth_email_placeholder")}</Label>
                <Input id="email" type="email" placeholder={t("auth_email_placeholder")} value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth_password_placeholder")}</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder={t("auth_password_placeholder")} 
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                    }}
                    required
                    disabled={loading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={loading}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                )}
              </div>
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{t("auth_confirm_password_placeholder")}</Label>
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth_confirm_password_placeholder")}
                    value={signupConfirmPassword}
                    onChange={(e) => {
                      setSignupConfirmPassword(e.target.value);
                      setPasswordError("");
                    }}
                    required
                    disabled={loading}
                  />
                </div>
              )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSignUp ? t("auth_sign_up") : t("auth_sign_in")}
                </Button>
              </form>)}

            {!isForgotPassword && !isPasswordUpdate && <>
                {/* Forgot Password Link */}
                {!isSignUp && <div className="text-center">
                    <Button variant="link" className="p-0 h-auto text-sm" onClick={() => setIsForgotPassword(true)} disabled={loading}>
                      {t("auth_forgot_password")}
                    </Button>
                  </div>}

                {/* Toggle Sign In/Up */}
                <div className="text-center text-sm">
                  <span className="text-muted-foreground">
                    {isSignUp ? t("auth_have_account") : t("auth_no_account")}
                  </span>{" "}
                  <Button variant="link" className="p-0 h-auto font-semibold" onClick={() => setIsSignUp(!isSignUp)} disabled={loading}>
                    {isSignUp ? t("auth_switch_to_login") : t("auth_switch_to_signup")}
                  </Button>
                </div>
              </>}
          </CardContent>
        </Card>
      </main>
      <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <Footer />
      </div>
    </div>;
};
export default Auth;