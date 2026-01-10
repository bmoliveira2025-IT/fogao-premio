import { NextResponse } from 'next/server';
import { getApps } from 'firebase-admin/app';

export async function GET() {
    const apps = getApps();
    const isFirebaseInitialized = apps.length > 0;

    // Check if env var exists (do not return value)
    const hasEnvVar = !!process.env.FIREBASE_SERVICE_ACCOUNT;
    let envVarPreview = "MISSING";

    if (hasEnvVar) {
        try {
            const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
            envVarPreview = `Matches project: ${parsed.project_id}`;
        } catch (e) {
            envVarPreview = "INVALID JSON";
        }
    }

    return NextResponse.json({
        status: 'ok',
        firebase_initialized: isFirebaseInitialized,
        env_var_present: hasEnvVar,
        env_var_status: envVarPreview,
        project_id: isFirebaseInitialized ? "Initialized (hidden)" : "Not Initialized",
        node_env: process.env.NODE_ENV
    });
}
