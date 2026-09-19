import { useRef, useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/ui/Icon";
import { Brand } from "../../components/layout/Brand";

interface FieldErrors {
  identifier?: string;
  password?: string;
}

const INPUT_BASE =
  "block w-full rounded-md border bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2";
const INPUT_OK = "border-slate-300 focus:border-amber-500 focus:ring-amber-500/30";
const INPUT_ERR = "border-red-400 focus:border-red-500 focus:ring-red-500/30";

// DEMO / PREVIEW ONLY. These are public, non-secret placeholder values that live in
// frontend code, so they provide no security. Real authentication (hashing, sessions,
// RBAC, rate limiting) belongs to the backend and must replace this check.
const DEMO_EMAIL = "demo@seal.local";
const DEMO_PASSWORD = "demo123";

/**
 * Local demo login. Credentials are compared in the browser only: nothing is sent,
 * stored or persisted, and no session is created.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [invalid, setInvalid] = useState(false);

  const identifierRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInvalid(false);

    const next: FieldErrors = {};
    if (identifier.trim() === "") next.identifier = "Enter your email or institutional ID.";
    if (password === "") next.password = "Enter your password.";
    setErrors(next);

    if (next.identifier) {
      identifierRef.current?.focus();
      return;
    }
    if (next.password) {
      passwordRef.current?.focus();
      return;
    }

    if (identifier.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      navigate("/dashboard");
      return;
    }

    setInvalid(true);
    setPassword("");
    passwordRef.current?.focus();
  };

  const clearError = (field: keyof FieldErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 lg:flex-row">
      {/* Brand panel */}
      <aside className="flex flex-col justify-between bg-slate-900 px-6 py-6 text-slate-300 lg:w-[44%] lg:max-w-xl lg:px-12 lg:py-12">
        <Brand />

        <div className="hidden lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-400">
            Examination control
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-snug text-white">
            AI-assisted paper preparation, kept under controlled infrastructure.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            SEAL helps authorised faculty prepare and validate balanced question papers while
            examination data stays inside the application&apos;s own backend.
          </p>
        </div>

        <p className="hidden text-xs leading-relaxed text-slate-500 lg:block">
          Academic prototype for an AKTU-style workflow. Not an official or production system.
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <div className="rounded-lg border border-slate-200 border-t-2 border-t-amber-500 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">
              Authorised access
            </p>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-slate-900">Sign in to SEAL</h2>
            <p className="mt-1 text-sm text-slate-600">
              Use your university or college credentials.
            </p>

            <div
              role="note"
              className="mt-5 flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-900"
            >
              <Badge tone="demo">Preview</Badge>
              <p>
                Demo authentication only. Real authentication is not connected yet, and nothing you
                enter is sent or stored.
              </p>
            </div>

            <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">Demo account</p>
              <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
                <dt>Email</dt>
                <dd className="font-mono text-slate-900">{DEMO_EMAIL}</dd>
                <dt>Password</dt>
                <dd className="font-mono text-slate-900">{DEMO_PASSWORD}</dd>
              </dl>
            </div>

            {invalid && (
              <div
                role="alert"
                className="mt-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800"
              >
                <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Invalid demo credentials.</p>
              </div>
            )}

            <form noValidate onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-slate-800">
                  Email or institutional ID
                </label>
                <input
                  ref={identifierRef}
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setInvalid(false);
                    if (errors.identifier) clearError("identifier");
                  }}
                  aria-invalid={errors.identifier ? true : undefined}
                  aria-describedby={errors.identifier ? "identifier-error" : undefined}
                  placeholder="name@college.edu or ID"
                  className={`mt-1.5 ${INPUT_BASE} ${errors.identifier ? INPUT_ERR : INPUT_OK}`}
                />
                {errors.identifier && (
                  <p id="identifier-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
                    <Icon name="alert" className="h-3.5 w-3.5 shrink-0" />
                    {errors.identifier}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-800">
                  Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    ref={passwordRef}
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setInvalid(false);
                      if (errors.password) clearError("password");
                    }}
                    aria-invalid={errors.password ? true : undefined}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    className={`${INPUT_BASE} pr-11 ${errors.password ? INPUT_ERR : INPUT_OK}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md text-slate-500 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    <Icon name={showPassword ? "eyeOff" : "eye"} className="h-[18px] w-[18px]" />
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
                    <Icon name="alert" className="h-3.5 w-3.5 shrink-0" />
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
              >
                Sign In
              </button>
            </form>
          </div>

          <div className="mt-5 flex items-start gap-3 px-1 text-xs leading-relaxed text-slate-600">
            <Icon name="security" className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
            <p>
              <span className="font-semibold text-slate-800">Authorised use only.</span> Access is
              restricted to authorised university and college personnel. Unauthorised access or
              misuse is prohibited, and security-relevant activity is intended to be recorded for
              audit once monitoring is implemented.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
