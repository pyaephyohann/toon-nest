/**
 * PasswordStrength Component
 * Visual password strength indicator with requirements
 */

interface PasswordStrengthProps {
  password: string;
  showRequirements?: boolean;
}

interface Requirement {
  label: string;
  met: boolean;
}

export function PasswordStrength({ password, showRequirements = true }: PasswordStrengthProps) {
  const calculateStrength = (pwd: string): number => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength++;
    return strength;
  };

  const strength = calculateStrength(password);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];

  const requirements: Requirement[] = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Uppercase & lowercase", met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: "At least one number", met: /\d/.test(password) },
    { label: "Special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const getStrengthColor = (index: number) => {
    if (index < strength) return strengthColors[strength - 1];
    return "bg-gray-700";
  };

  return (
    <div className="mt-2">
      {/* Strength meter */}
      <div className="flex gap-1 mb-2">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${getStrengthColor(index)}`}
          />
        ))}
      </div>
      
      {/* Strength label */}
      {password && (
        <p className={`text-xs font-medium ${
          strength <= 2 ? "text-red-400" :
          strength === 3 ? "text-yellow-400" :
          "text-green-400"
        }`}>
          {strengthLabels[strength - 1] || ""}
        </p>
      )}
      
      {/* Requirements list */}
      {showRequirements && (
        <ul className="mt-3 space-y-1">
          {requirements.map((req, index) => (
            <li 
              key={index}
              className={`text-xs flex items-center gap-2 ${
                req.met ? "text-green-400" : "text-gray-500"
              }`}
            >
              <svg 
                className={`w-4 h-4 ${req.met ? "text-green-400" : "text-gray-600"}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {req.met ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                )}
              </svg>
              {req.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
