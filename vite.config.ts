import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import px2rem from 'postcss-px2rem'
// import px2viewport from 'postcss-px-to-viewport'
import pkg from './package.json'
import path from 'path'
import fs from 'fs'

import Pages from 'vite-plugin-pages'
import matter from 'gray-matter'
// import anchor from 'markdown-it-anchor'

const resolve = (dir: string): string => path.resolve(__dirname, dir);
const IS_DEV: boolean = process.env.NODE_ENV === 'development' ? true : false;

// // 版权信息配置
// const bannerPlugin = (banner) => {
//   return {
//     name: 'banner',
//     async writeBundle (NULL, bundle) {
//       for (const fileName of Object.entries(bundle)) {
//         const file = fileName[0]
//         const extRegex = new RegExp(/\.(css|js)$/i)
//         const vendorRegex = new RegExp(/vendor/)
//         if (extRegex.test(file) && !vendorRegex.test(file)) {
//           let data = fs.readFileSync('./dist/' + file, { encoding: 'utf8' })
//           data = `/* ${banner} */ ${data}`
//           fs.writeFileSync('./dist/' + file, data)
//         }
//       }
//     }
//   }
// }
// const ResolveBanner = () => {
//   return `/** 
//  * name: ${pkg.name}
//  * version: v${pkg.version}
//  * author: ${pkg.author}
//  */
//  `;
// }

// https://vitejs.dev/config/
export default defineConfig({
  base: IS_DEV ? '/' : '/',
  server: {
    port: 3000,
    // proxy: {
    //   '/foo': 'http://localhost:4567/foo',
    //   '/api': {
    //     target: 'http://jsonplaceholder.typicode.com',
    //     ws: true,
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, '')
    //   }
    // }
  },
  build: {
    assetsInlineLimit: 1024 * 4,
    rollupOptions: {
      plugins: [
        // bannerPlugin(`/** 
        // * name: ${pkg.name}
        // * version: v${pkg.version}
        // * author: ${pkg.author}
        // */
        // `)
      ]
    }
  },
  css: {
    postcss: {
      plugins: [
        // px2rem({
        //   remUnit: 75
        // }),
        // px2viewport({
        //   viewportWidth: 750,
        //   minPixelValue: 1
        // })
      ]
    }
  },
  alias: {
    '/@': resolve('src'),
    '/@img': resolve('src/assets/img'),
    '/@styl': resolve('src/assets/styl'),
    '/@js': resolve('src/assets/js'),
    '/@ts': resolve('src/assets/ts'),
    '/@fonts': resolve('src/assets/fonts'),
    '/@css': resolve('src/assets/css'),
    '/@libs': resolve('src/libs'),
    '/@cp': resolve('src/components'),
    '/@views': resolve('src/views'),
    '/@plugins': resolve('src/plugins')
  },
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),

    Pages({
      extensions: ['vue', 'md'],
      pagesDir: 'pages',
      extendRoute(route) {
        const path = resolve(route.component.slice(1))

        if (!path.includes('projects.md')) {
          const md = fs.readFileSync(path, 'utf-8')
          const { data } = matter(md)
          route.meta = Object.assign(route.meta || {}, { frontmatter: data })
        }

        return route
      },
    }),
  ]
})
