// src/ui/steps/CompanyStep.tsx
import { useForm, useFormDispatch } from "../../form/FormProvider";
import { validateCompany } from "../../form/validation/company";
import { useRegistrationCheck } from "../../form/hooks/useRegistrationCheck";
import { TextField } from "../fields/TextField";
import { visibleError } from "../fields/visibility";

export function CompanyStep() {
  const { values, touched, serverErrors, attempted, registration } = useForm();
  const dispatch = useFormDispatch();
  const c = values.company;
  const errors = validateCompany(c); // derived on every render

  useRegistrationCheck(c.registrationNumber, errors.registrationNumber);

  const gate = (field: keyof typeof c) => ({
    touched: touched.company[field],
    attempted: attempted.company,
  });

  const registrationStatus =
    registration.value === c.registrationNumber
      ? registration.status === "checking" ? "Checking availability..."
      : registration.status === "available" ? "Registration number is available."
      : registration.status === "taken" ? "" /* shown as an error */
      : registration.status === "error" ? "Could not verify right now; we will check again when you submit."
      : ""
      : "";

  return (
    <>
      <TextField
        path="company.name" label="Company name" required
        value={c.name}
        onValueChange={(value) => dispatch({ type: "company/changed", field: "name", value })}
        onBlur={() => dispatch({ type: "company/blurred", field: "name" })}
        error={visibleError(errors.name, gate("name"), serverErrors.company.name)}
        autoComplete="organization"
      />

      <TextField
        path="company.registrationNumber" label="Company registration number" required
        hint="Letters and digits, 6 to 12 characters."
        value={c.registrationNumber}
        onValueChange={(value) => dispatch({ type: "company/changed", field: "registrationNumber", value })}
        onBlur={() => dispatch({ type: "company/blurred", field: "registrationNumber" })}
        error={visibleError(
          errors.registrationNumber ??
            (registration.value === c.registrationNumber && registration.status === "taken"
              ? "This registration number is already registered."
              : undefined),
          gate("registrationNumber"),
          serverErrors.company.registrationNumber,
        )}
      />
      <p aria-live="polite" className="status">{registrationStatus}</p>

      {/* country (select), contactEmail, phone follow the same pattern */}
    </>
  );
}
