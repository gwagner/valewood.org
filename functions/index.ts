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

    // bail early if we are not looking at a search
    if(url.searchParams.get('s') == null)
        return next();

    const asset = await env.ASSETS.fetch(url.origin + '/search/');
    if(asset && asset.status === 200){
        // If we did not get a proper status code back, then bail
        if([101, 204, 205, 304].includes(asset.status)){
            return next()
        }

        // found the asset, so we can serve it
        return asset;
    }
	

	// no acceptable formats found, pass-through for original image
	return next();
}
