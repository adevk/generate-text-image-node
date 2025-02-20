import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class GenerateImage implements ICredentialType {
	name = 'GenerateImageApi';
	displayName = 'GenerateImage Api';
	// Uses the link to this tutorial as an example
	// Replace with your own docs links when building your own nodes
	properties: INodeProperties[] = [];
}
