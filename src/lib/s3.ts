import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET || ''
const CDN_URL = process.env.AWS_CDN_URL || `https://${BUCKET_NAME}.s3.amazonaws.com`

interface UploadResult {
  url: string
  key: string
}

export async function uploadToS3(
  buffer: Buffer,
  key: string,
  contentType: string = 'image/webp'
): Promise<UploadResult> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  })

  await s3Client.send(command)

  const url = `${CDN_URL}/${key}`

  return { url, key }
}

export function generateS3Key(storeId: string, filename: string): string {
  const timestamp = Date.now()
  const sanitizedFilename = filename
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50)

  return `stores/${storeId}/${timestamp}-${sanitizedFilename}.webp`
}

export async function deleteStoreFilesFromS3(storeId: string): Promise<number> {
  const prefix = `stores/${storeId}/`
  let deletedCount = 0

  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix,
    })

    const listResult = await s3Client.send(listCommand)

    if (!listResult.Contents || listResult.Contents.length === 0) {
      return 0
    }

    const objectsToDelete = listResult.Contents.map((obj) => ({
      Key: obj.Key!,
    }))

    const deleteCommand = new DeleteObjectsCommand({
      Bucket: BUCKET_NAME,
      Delete: {
        Objects: objectsToDelete,
        Quiet: true,
      },
    })

    await s3Client.send(deleteCommand)
    deletedCount = objectsToDelete.length

    if (listResult.IsTruncated) {
      deletedCount += await deleteStoreFilesFromS3(storeId)
    }
  } catch (error) {
    console.error(`[S3] Erro ao deletar arquivos da loja ${storeId}:`, error)
  }

  return deletedCount
}
