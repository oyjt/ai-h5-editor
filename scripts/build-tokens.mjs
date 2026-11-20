// 用 Style Dictionary 把 tokens/*.tokens.json 编译成 CSS 变量和 TypeScript 映射
import { mkdirSync } from 'node:fs'
import StyleDictionary from 'style-dictionary'

const PREFIX = 'ud'

StyleDictionary.registerFormat({
  name: 'ud/ts-map',
  format: ({ dictionary }) => {
    const entries = dictionary.allTokens.map(token => ({
      path: token.path.join('.'),
      group: token.path[0],
      value: String(token.$value ?? token.value),
      cssVar: `--${PREFIX}-${token.path.join('-')}`,
    }))
    return `/* 由 scripts/build-tokens.mjs 生成，请勿手改 */\nexport interface DesignToken { path: string, group: string, value: string, cssVar: string }\nexport const designTokens: DesignToken[] = ${JSON.stringify(entries, null, 2)}\n`
  },
})

StyleDictionary.registerFormat({
  name: 'ud/uno-theme',
  format: ({ dictionary }) => {
    const colors = {}
    for (const token of dictionary.allTokens) {
      if (token.path[0] !== 'color') continue
      colors[token.path.slice(1).join('-')] = `var(--${PREFIX}-${token.path.join('-')})`
    }
    return `/* 由 scripts/build-tokens.mjs 生成，请勿手改 */\nexport const unoThemeColors = ${JSON.stringify(colors, null, 2)}\n`
  },
})

mkdirSync('src/design', { recursive: true })
mkdirSync('src/styles', { recursive: true })

const sd = new StyleDictionary({
  source: ['tokens/*.tokens.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: PREFIX,
      buildPath: 'src/styles/',
      files: [{ destination: 'tokens.generated.css', format: 'css/variables', options: { outputReferences: true } }],
    },
    ts: {
      transformGroup: 'css',
      buildPath: 'src/design/',
      files: [
        { destination: 'tokens.generated.ts', format: 'ud/ts-map' },
        { destination: 'uno-theme.generated.ts', format: 'ud/uno-theme' },
      ],
    },
  },
})

await sd.buildAllPlatforms()
