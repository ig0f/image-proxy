async function fetchImage(url) {
    const response = await fetch(`https://image-proxy.ig0f.pages.dev/api/proxy?url=${encodeURIComponent(url)}`);
    if (response.ok) {
        return response.blob();
    } else {
        throw new Error('Error fetching image');
    }
}

async function handleImageRequests(event) {
    const urlParams = new URLSearchParams(event.request.url.split('?')[1]);
    const imageUrl = urlParams.get('url');

    if (imageUrl) {
        try {
            const imageBlob = await fetchImage(imageUrl);
            return new Response(imageBlob, {
                status: 200,
                headers: {
                    'Content-Type': imageBlob.type,
                    'Access-Control-Allow-Origin': '*'
                }
            });
        } catch (error) {
            return new Response('Error fetching image', { status: 500 });
        }
    } else {
        return new Response('Missing "url" parameter', { status: 400 });
    }
}

addEventListener('fetch', event => {
    event.respondWith(handleImageRequests(event));
});
