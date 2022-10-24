export async function onRequest(context) {
    // Contents of context object
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;

    const url = new URL(request.url);

    // Process if we are dealing with a search
    if(url.searchParams.get('s') != null) {
        const assetURL = new URL('/search/', request.url).toString();
        const assetReq = new Request(assetURL, {
            cf: request.cf
        });
        const asset = await env.ASSETS.fetch(assetReq);
        if(asset && asset.status === 200){

            // found the asset, so we can serve it
            return asset;
        }

        // bail if we did not return an asset
        return next();
    }

    // Process if we are dealing a feed url
    if(url.href.includes("/feed/")) {
        const assetURL = new URL(request.url + 'index.xml').toString();
        const assetReq = new Request(assetURL, {
            cf: request.cf
        });
        const asset = await env.ASSETS.fetch(assetReq);
        if(asset && asset.status === 200){
            // found the asset, so we can serve it
            return asset;
        }

        // bail if we did not return an asset
        return next();
    }

	// no acceptable formats found, pass-through for original image
	return next();
}
