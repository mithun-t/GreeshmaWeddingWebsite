import { promises as fs } from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

function rsvpApiPlugin(): Plugin {
  return {
    name: 'rsvp-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/rsvp' && req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })

          req.on('end', async () => {
            try {
              const data = JSON.parse(body)
              const filePath = path.resolve(import.meta.dirname, 'src/data/rsvps.json')
              
              let existingList: any[] = []
              try {
                const content = await fs.readFile(filePath, 'utf-8')
                existingList = JSON.parse(content)
              } catch {
                existingList = []
              }

              existingList.push({
                ...data,
                id: 'rsvp_' + Date.now(),
                submittedAt: new Date().toISOString(),
              })

              await fs.writeFile(filePath, JSON.stringify(existingList, null, 2) + '\n', 'utf-8')

              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify({ success: true, message: 'RSVP saved successfully' }))
            } catch (error) {
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 500
              res.end(
                JSON.stringify({
                  success: false,
                  error: error instanceof Error ? error.message : 'Unknown error',
                }),
              )
            }
          })
          return
        }

        if (req.url === '/api/rsvp' && req.method === 'GET') {
          try {
            const filePath = path.resolve(import.meta.dirname, 'src/data/rsvps.json')
            const content = await fs.readFile(filePath, 'utf-8')
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 200
            res.end(content)
          } catch {
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 200
            res.end(JSON.stringify([]))
          }
          return
        }

        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), rsvpApiPlugin()],
})
