import { mkdir, writeFile } from 'fs/promises'
import path from 'path'

export async function uploadToLocal(file: File): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer())
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

    await mkdir(uploadsDir, { recursive: true })

    const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`
    const filePath = path.join(uploadsDir, filename)

    await writeFile(filePath, buffer)

    return `/uploads/${filename}` // URL pública
}
