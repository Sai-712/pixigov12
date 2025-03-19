import { S3Client } from '@aws-sdk/client-s3';
import { RekognitionClient } from '@aws-sdk/client-rekognition';

export const region = import.meta.env.VITE_AWS_REGION || 'us-east-1';

// Development mode check
export const isDevelopment = import.meta.env.DEV || false;

// Validate required environment variables
const validateEnvVariables = () => {
    const requiredVars = {
        'AWS Access Key ID': import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        'AWS Secret Access Key': import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
        'S3 Bucket Name': import.meta.env.VITE_S3_BUCKET_NAME
    };

    const missingVars = Object.entries(requiredVars)
        .filter(([_, value]) => !value)
        .map(([name]) => name);

    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    return {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
        bucketName: import.meta.env.VITE_S3_BUCKET_NAME
    };
};

// Get validated credentials
const { accessKeyId, secretAccessKey, bucketName } = validateEnvVariables();

// Initialize S3 client with proper error handling
export const s3Client = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
    forcePathStyle: true,
    maxAttempts: 3,
    retryMode: 'adaptive',
    // Add additional configuration for production environment
    endpoint: undefined, // Use default endpoint
    tls: true, // Ensure TLS is used
    requestHandler: undefined // Use default handler for better compatibility
});

// Initialize Rekognition client with proper error handling
export const rekognitionClient = new RekognitionClient({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
    maxAttempts: 3,
    retryMode: 'adaptive'
});

export const S3_BUCKET_NAME = bucketName;