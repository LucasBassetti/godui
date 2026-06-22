import * as parserBabel from "prettier/plugins/babel";
import * as parserEstree from "prettier/plugins/estree";
import * as parserPostcss from "prettier/plugins/postcss";
import * as parserTypeScript from "prettier/plugins/typescript";
import * as prettier from "prettier/standalone";

const plugins = [parserEstree, parserBabel, parserTypeScript, parserPostcss];

const parserByLang: Record<string, string> = {
  tsx: "typescript",
  ts: "typescript",
  jsx: "babel",
  js: "babel",
  css: "css",
};

export async function formatCode(code: string, lang = "tsx"): Promise<string> {
  const trimmed = code.trim();
  if (!trimmed) {
    return trimmed;
  }

  const parser = parserByLang[lang] ?? "babel";

  try {
    return (
      await prettier.format(trimmed, {
        parser,
        plugins,
        semi: true,
        singleQuote: false,
        tabWidth: 2,
        printWidth: 80,
        trailingComma: "all",
        bracketSpacing: true,
        arrowParens: "always",
      })
    ).trimEnd();
  } catch {
    return trimmed;
  }
}
