import { NextRequest, NextResponse } from 'next/server';
import { uploadToGitHubStorage } from '../../../lib/githubStorage';
import { requireSession, isResponse } from '../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const guard = await requireSession(req);
  if (isResponse(guard)) return guard;
  try {
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const folder = (formData.get('folder') as string) || 'uploads';
      const branch = (formData.get('branch') as string) || 'general';

      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No file provided for upload' },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const base64Content = buffer.toString('base64');
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `media/${branch.toLowerCase()}/${folder}/${timestamp}_${sanitizedName}`;

      const uploadResult = await uploadToGitHubStorage(
        filePath,
        base64Content,
        `Media upload: ${file.name} for ${branch} to repository media archive`
      );

      if (!uploadResult.success) {
        return NextResponse.json(
          { success: false, error: uploadResult.error || 'Failed to commit media to GitHub repository' },
          { status: 502 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'File committed to repository media folder successfully',
        url: uploadResult.cdnUrl,
        cdnUrl: uploadResult.cdnUrl,
        rawUrl: uploadResult.rawUrl,
        filePath: uploadResult.filePath,
      });
    } else {
      // JSON base64 upload
      const body = await req.json();
      const { filename, base64, folder, branch } = body;

      if (!filename || !base64) {
        return NextResponse.json(
          { success: false, error: 'Filename and base64 content are required' },
          { status: 400 }
        );
      }

      const cleanBase64 = base64.replace(/^data:[^;]+;base64,/, '');
      const timestamp = Date.now();
      const sanitizedName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
      const branchFolder = branch ? branch.toLowerCase() : 'general';
      const subFolder = folder || 'images';
      const filePath = `media/${branchFolder}/${subFolder}/${timestamp}_${sanitizedName}`;

      const uploadResult = await uploadToGitHubStorage(
        filePath,
        cleanBase64,
        `Media upload: ${filename} for ${branchFolder} to repository media archive`
      );

      if (!uploadResult.success) {
        return NextResponse.json(
          { success: false, error: uploadResult.error || 'Failed to commit media to GitHub repository' },
          { status: 502 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'File committed to repository media folder successfully',
        url: uploadResult.cdnUrl,
        cdnUrl: uploadResult.cdnUrl,
        rawUrl: uploadResult.rawUrl,
        filePath: uploadResult.filePath,
      });
    }
  } catch (error: any) {
    console.error('Repository media upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Media upload to GitHub repository failed' },
      { status: 500 }
    );
  }
}
