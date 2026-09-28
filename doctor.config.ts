// React Doctor configuration (https://react.doctor/docs/configuration/config-files).
export default {
  ignore: {
    // Build output, generated reports, and tests are not shipped React source.
    files: [
      "dist/**",
      "output/**",
      "playwright-report/**",
      "test-results/**",
      "e2e/**",
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/__tests__/**",
    ],
    // Reviewed false positives, suppressed per file so the rules keep checking everything else.
    overrides: [
      {
        // Password changes and reset emails don't touch any cached query data, so there is nothing to invalidate.
        files: [
          "client/src/components/shared/user-profile-dialog.tsx",
          "client/src/features/admin/users-page.tsx",
          "client/src/features/auth/forgot-password-page.tsx",
          "client/src/features/auth/reset-password-page.tsx",
        ],
        rules: ["react-doctor/query-mutation-missing-invalidation"],
      },
      {
        // isLoading is reset in `finally` (only for foreground actions), and the effect "fetch" is the
        // keepalive lock release sent when the editor unmounts or the page unloads.
        files: ["client/src/hooks/use-editor-lock.ts"],
        rules: ["react-doctor/no-loading-flag-reset-outside-finally", "react-doctor/no-fetch-in-effect"],
      },
      {
        // `includes` here is String.prototype.includes on serialized content, not an array lookup.
        files: ["server/services/system-cms-pages.service.ts"],
        rules: ["react-doctor/js-set-map-lookups"],
      },
      {
        // Starter sections are created one at a time on purpose so the library keeps its createdAt order.
        files: ["server/services/system-cms-sections.service.ts"],
        rules: ["react-doctor/async-await-in-loop"],
      },
    ],
  },
};
