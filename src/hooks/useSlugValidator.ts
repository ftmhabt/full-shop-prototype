"use client";

import { useEffect, useState } from "react";

/**
 * A custom React hook to validate a slug string.
 * It checks if the slug contains only English letters, numbers, hyphens, or underscores.
 * It also specifically checks for Persian characters and provides a tailored error message.
 *
 * @param {string} slug - The slug string to validate.
 * @returns {{ isValid: boolean, errorMessage: string }} An object with the validation status and an error message.
 */
export function useSlugValidator(slug: string) {
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Regex to check for any characters that are NOT English letters, numbers, hyphens, or underscores
    // This is the main check for invalid characters
    const invalidCharsRegex = /[^a-zA-Z0-9_-]/;

    // Regex to specifically check for Persian/Arabic characters
    // This allows for a more specific error message
    const persianRegex = /[\u0600-\u06FF\s]/;

    if (!slug.trim()) {
      setIsValid(false);
      setErrorMessage("اسلاگ نباید خالی باشد");
    } else if (persianRegex.test(slug)) {
      setIsValid(false);
      setErrorMessage("لطفا از حروف انگلیسی استفاده کنید.");
    } else if (invalidCharsRegex.test(slug)) {
      setIsValid(false);
      setErrorMessage(
        "اسلاگ تنها می‌تواند شامل حروف انگلیسی، اعداد، خط تیره و زیرخط باشد."
      );
    } else {
      setIsValid(true);
      setErrorMessage("");
    }
  }, [slug]);

  return { isValid, errorMessage };
}
