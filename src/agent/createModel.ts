import { AzureChatOpenAI } from "@langchain/openai";

interface ModelSettings {
  apiKey: string;
  deploymentName: string;
  apiVersion: string;
  basePath: string;
}

function readEndpoint(): string | undefined {
  const endpoint =
    process.env.AZURE_OPENAI_ENDPOINT ??
    process.env.AZURE_OPENAI_API_ENDPOINT;

  if (endpoint) {
    return endpoint.replace(/\/$/, "");
  }

  const instanceName = process.env.AZURE_OPENAI_API_INSTANCE_NAME;

  return instanceName
    ? `https://${instanceName}.openai.azure.com`
    : undefined;
}

function readModelSettings(): ModelSettings {
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const endpoint = readEndpoint();
  const deploymentName =
    process.env.AZURE_OPENAI_DEPLOYMENT_NAME ??
    process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME;

  if (!apiKey || !endpoint || !deploymentName) {
    throw new Error(
      "Set AZURE_OPENAI_API_KEY, AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_DEPLOYMENT_NAME",
    );
  }

  return {
    apiKey,
    deploymentName,
    apiVersion:
      process.env.AZURE_API_VERSION ??
      process.env.AZURE_OPENAI_API_VERSION ??
      "2025-01-01-preview",
    basePath: `${endpoint}/openai/deployments`,
  };
}

export function createExaminerModel(): AzureChatOpenAI {
  const settings = readModelSettings();

  return new AzureChatOpenAI({
    azureOpenAIApiKey: settings.apiKey,
    azureOpenAIApiDeploymentName: settings.deploymentName,
    azureOpenAIApiVersion: settings.apiVersion,
    azureOpenAIBasePath: settings.basePath,
    temperature: 0,
    maxRetries: 2,
  });
}

export function hasModelSettings(): boolean {
  return Boolean(
    process.env.AZURE_OPENAI_API_KEY &&
      readEndpoint() &&
      (process.env.AZURE_OPENAI_DEPLOYMENT_NAME ??
        process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME),
  );
}
