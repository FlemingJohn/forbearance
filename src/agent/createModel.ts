import { AzureChatOpenAI } from "@langchain/openai";

interface ModelSettings {
  apiKey: string;
  instanceName: string;
  deploymentName: string;
  apiVersion: string;
  temperature: number;
}

function readModelSettings(): ModelSettings {
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const instanceName = process.env.AZURE_OPENAI_API_INSTANCE_NAME;
  const deploymentName = process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME;

  if (!apiKey || !instanceName || !deploymentName) {
    throw new Error(
      "Set AZURE_OPENAI_API_KEY, AZURE_OPENAI_API_INSTANCE_NAME and AZURE_OPENAI_API_DEPLOYMENT_NAME",
    );
  }

  return {
    apiKey,
    instanceName,
    deploymentName,
    apiVersion: process.env.AZURE_OPENAI_API_VERSION ?? "2024-10-21",
    temperature: 0,
  };
}

export function createExaminerModel(): AzureChatOpenAI {
  const settings = readModelSettings();

  return new AzureChatOpenAI({
    azureOpenAIApiKey: settings.apiKey,
    azureOpenAIApiInstanceName: settings.instanceName,
    azureOpenAIApiDeploymentName: settings.deploymentName,
    azureOpenAIApiVersion: settings.apiVersion,
    temperature: settings.temperature,
    maxRetries: 2,
  });
}

export function hasModelSettings(): boolean {
  return Boolean(
    process.env.AZURE_OPENAI_API_KEY &&
      process.env.AZURE_OPENAI_API_INSTANCE_NAME &&
      process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
  );
}
