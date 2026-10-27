// src/form/validation/company.ts
import type { CompanyValues } from "../types";
import { EMAIL_RE, firstError, matches, maxLength, required } from "./rules";
import { stripUndefined, type Errors } from "./vehicle";

export function validateCompany(c: CompanyValues): Errors<CompanyValues> {
  return stripUndefined({
    name: firstError(c.name, required("Enter the company name."), maxLength(120, "Use 120 characters or fewer.")),
    registrationNumber: firstError(
      c.registrationNumber,
      required("Enter the company registration number."),
      matches(/^[A-Za-z0-9]{6,12}$/, "Use 6 to 12 letters or digits, no spaces."),
    ),
    country: c.country === "" ? "Choose a country." : undefined,
    contactEmail: firstError(c.contactEmail, required("Enter a contact email."), matches(EMAIL_RE, "Enter a valid email address.")),
    phone: firstError(c.phone, required("Enter a phone number."), matches(/^[+()\d\s-]{7,20}$/, "Enter a valid phone number.")),
  });
}
