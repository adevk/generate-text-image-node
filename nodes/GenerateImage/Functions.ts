import { IHookFunctions, IExecuteFunctions, IHttpRequestMethods, IDataObject, IRequestOptions, NodeApiError, JsonObject } from "n8n-workflow";

export async function apiRequest(
	this: IHookFunctions | IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	qs: IDataObject,
	option: IDataObject = {},
	uri?: string | undefined,
): Promise<any> {
	// const credentials = await this.getCredentials('generateImageApi');

	// qs.api_key = credentials.api_key as string;

	const options: IRequestOptions = {
		method,
		qs,
		uri: uri || `https://dummyjson.com${endpoint}`,
		json: false,
		encoding: null,
		useStream: true //This is what makes the image file to be correctly treated as a binary image
	};

	if (Object.keys(option)) {
		Object.assign(options, option);
	}

	try {
		const response =  await this.helpers.request(options);
		return response;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}