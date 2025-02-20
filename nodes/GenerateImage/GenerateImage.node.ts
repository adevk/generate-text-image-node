import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeApiError,
	JsonObject,
} from 'n8n-workflow';
import { apiRequest } from './Functions';

export class GenerateImage implements INodeType {
	description: INodeTypeDescription = {
		// Basic node details will go here
		displayName: 'Generate Image',
		// eslint-disable-next-line n8n-nodes-base/node-class-description-name-miscased
		name: 'generateImage',
		// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
		icon: 'file:icon.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Generate Text Based Images',
		defaults: {
			name: 'Generate Image',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [],
		requestDefaults: {
			baseURL: 'https://dummyjson.com',
		},
		properties: [
			// Operations will go here
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Generate Image',
						value: 'generate',
						action: 'Generate a text image',
						description: 'Generate a text image',
					},
				],
				default: 'generate',
			},
			{
				displayName: 'Image Width',
				name: 'imageWidth',
				type: 'number',
				required: true,
				default: 150,
			},
			{
				displayName: 'Image Height',
				name: 'imageHeight',
				type: 'number',
				required: true,
				default: 150,
			},
			{
				displayName: 'Background Color (hexadecimal)',
				name: 'backgroundColor',
				type: 'color',
				required: true,
				default: '#000000',
			},
			{
				displayName: 'Text Color',
				name: 'textColor',
				type: 'color',
				required: true,
				default: '#ffffff',
			},
			{
				displayName: 'Font Family',
				name: 'fontFamily',
				type: 'options',
				options: [
					{
						name: 'Pacifico',
						value: 'pacifico',
					},
					{
						name: 'Poppins',
						value: 'poppins',
					},
					{
						name: 'Quicksand',
						value: 'quicksand',
					},
					{
						name: 'Bitter',
						value: 'bitter',
					},
					{
						name: 'Cairo',
						value: 'cairo',
					},
					{
						name: 'Comfortaa',
						value: 'comfortaa',
					},
					{
						name: 'Cookie',
						value: 'cookie',
					},
					{
						name: 'Dosis',
						value: 'dosis',
					},
					{
						name: 'Gotham',
						value: 'gothamn',
					},
					{
						name: 'Lobster',
						value: 'lobster',
					},
					{
						name: 'Marhey',
						value: 'marhey',
					},
					{
						name: 'Qwigley',
						value: 'qwigley',
					},
					{
						name: 'Satisfy',
						value: 'satisfy',
					},
					{
						name: 'Ubuntu',
						value: 'ubuntu',
					},
				],
				default: 'pacifico',
			},
			{
				displayName: 'Font Size',
				name: 'fontSize',
				type: 'number',
				required: true,
				default: 14,
			},
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				required: true,
				default: 'image',
			},
			{
				displayName: 'Image Format',
				name: 'type',
				type: 'options',
				options: [
					{
						name: 'PNG',
						value: 'png',
					},
					{
						name: 'JPG',
						value: 'jpg',
					},
					{
						name: 'WEBP',
						value: 'webp',
					},
				],
				default: 'png',
			},
			// Optional/additional fields will go here
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		//const items = this.getInputData();
		// const resource = this.getNodeParameter('resource', 0);
		//const operation = this.getNodeParameter('operation', 0);
		const backgroundColorParam = this.getNodeParameter('backgroundColor', 0);
		const backgroundColor =
			typeof backgroundColorParam === 'string' && backgroundColorParam.startsWith('#')
				? backgroundColorParam.substring(1)
				: backgroundColorParam;

		const textColorParam = this.getNodeParameter('textColor', 0);
		const textColor =
			typeof textColorParam === 'string' && textColorParam.startsWith('#')
				? textColorParam.substring(1)
				: textColorParam;

		const imageWidth = this.getNodeParameter('imageWidth', 0);
		const imageHeight = this.getNodeParameter('imageHeight', 0);
		const fontFamily = this.getNodeParameter('fontFamily', 0);
		const fontSize = this.getNodeParameter('fontSize', 0);
		const text = this.getNodeParameter('text', 0);
		const type = this.getNodeParameter('type', 0);
		//console.log(imageSize, backgroundColor, textColor, fontFamily, fontSize, text)

		const qs: IDataObject = {
			fontFamily: fontFamily,
			fontSize: fontSize,
			text: text,
			type: type,
		};
		const imageSize = `${imageWidth}x${imageHeight}`;
		const endpoint = `/image/${imageSize}/${backgroundColor}/${textColor}`;
		console.log(endpoint);
		const responseData = await apiRequest.call(this, 'GET', endpoint, qs);
		//console.log("response: " + responseData)
		const preparedBinaryData = await this.helpers.prepareBinaryData(
			responseData,
			`image.${type}`, // Optional filename.
			`image/${type}`, // MIME type.
		);

		const newItem: INodeExecutionData = {
			json: {},
			binary: {
				data: preparedBinaryData,
			},
		};
		const returnData = this.helpers.returnJsonArray(newItem);

		return [returnData];
	}
}
