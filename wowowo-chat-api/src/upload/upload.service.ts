import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';

@Injectable()
export class UploadService {
  private octokit: Octokit;

  constructor() {
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) throw new Error('GITHUB_TOKEN is not defined');

    this.octokit = new Octokit({ auth: githubToken });
  }

  async uploadToGitHub(file: Express.Multer.File): Promise<string> {
    const filePath = `${Date.now()}-${file.originalname}`;
    const fileContent = Buffer.from(file.buffer).toString('base64');

    try {
      await this.octokit.repos.createOrUpdateFileContents({
        owner: process.env.GITHUB_REPO_OWNER!,
        repo: process.env.GITHUB_REPO_NAME!,
        path: filePath,
        message: `Upload image: ${file.originalname}`,
        content: fileContent,
        branch: process.env.GITHUB_BRANCH,
      });

      return `https://raw.githubusercontent.com/${process.env.GITHUB_REPO_OWNER}/${process.env.GITHUB_REPO_NAME}/${process.env.GITHUB_BRANCH}/${filePath}`;
    } catch (error: unknown) {
      console.error('GitHub upload error:', error);
      const errorMessage =
        error instanceof Error
          ? `Failed to upload: ${error.message}`
          : 'Failed to upload (unknown error)';
      throw new Error(errorMessage);
    }
  }
}
