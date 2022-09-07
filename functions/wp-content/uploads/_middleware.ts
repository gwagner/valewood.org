import assetNegotiationPlugin from "pages-plugin-asset-negotiation";

export const onRequest: PagesFunction = assetNegotiationPlugin({
	formats: ['webp'],
});