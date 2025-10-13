import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  // Base Next.js + TypeScript configs
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // ✅ Kendi kurallarını en sona koyarak override et
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "unused-imports": (await import("eslint-plugin-unused-imports")).default,
    },
    rules: {
      /** ---------- TypeScript ---------- **/
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_"
        }
      ],
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": "off",

      /** ---------- React ---------- **/
      "react/jsx-key": "error",
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-no-undef": "error",
      "react/no-unknown-property": "error",
      "react/no-unescaped-entities": "warn",
      "react/no-danger-with-children": "error",
      "react/no-deprecated": "warn",

      /** ---------- General JS ---------- **/
      "no-console": "warn",
      "no-empty": "warn",
      "no-debugger": "error",
      "no-alert": "warn",
      "no-var": "error",
      "prefer-const": "warn",
      "no-unused-expressions": "error",
      "no-duplicate-imports": "error",
      "no-unreachable": "error",
      "no-constant-condition": "warn",
      "no-irregular-whitespace": "error",
      "no-unexpected-multiline": "error",
      "valid-typeof": "error",

      /** ---------- Next.js specific ---------- **/
      "@next/next/no-html-link-for-pages": "warn",
      "@next/next/no-img-element": "warn",
      "@next/next/no-sync-scripts": "warn",
      "@next/next/no-title-in-document-head": "warn",
    },
  },

  // ✅ Ignore patterns
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "next-env.d.ts",
      "*.config.{js,cjs,mjs,ts}",
    ],
  },
];
