
const globalForS3 = globalThis as unknown as {
    s3: Bun.S3Client | undefined
}

export const s3 = globalForS3.s3 ?? new Bun.S3Client({
    region: process.env.S3_REGION,
    bucket: process.env.S3_BUCKET,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    endpoint: process.env.S3_ENDPOINT,
})