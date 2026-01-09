/**
 * CORS Proxy for Google Apps Script
 *
 * This proxy forwards requests to Google Apps Script to bypass CORS restrictions
 * when developing on localhost.
 */

import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express()
const PORT = 3002

// Enable CORS for all origins
app.use(cors())
app.use(express.json())

/**
 * Proxy endpoint for Google Apps Script
 */
app.all('/proxy', async (req: Request, res: Response) => {
    const targetUrl = req.query.url as string

    if (!targetUrl) {
        return res.status(400).json({ error: 'Missing url parameter' })
    }

    try {
        const options: RequestInit = {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
            },
        }

        // Forward body for POST requests
        if (req.method === 'POST' && req.body) {
            options.body = JSON.stringify(req.body)
        }

        const response = await fetch(targetUrl, options)
        const data = await response.json()

        res.json(data)
    } catch (error) {
        console.error('Proxy error:', error)
        res.status(500).json({
            error: 'Proxy request failed',
            details: error instanceof Error ? error.message : String(error)
        })
    }
})

app.listen(PORT, () => {
    console.log(`🔄 CORS Proxy running on http://localhost:${PORT}`)
    console.log(`   Use: http://localhost:${PORT}/proxy?url=YOUR_APPS_SCRIPT_URL`)
})
