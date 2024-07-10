addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const imageUrl = url.searchParams.get('url');

  if (!imageUrl) {
    return new Response('Missing "url" parameter', { status: 400 });
  }

  const modifiedRequest = new Request(imageUrl, {
    headers: {
      'Referer': 'https://weibo.com/',
      ...request.headers
    },
    method: 'GET'
  });

  try {
    const response = await fetch(modifiedRequest);
    if (!response.ok) {
      return new Response('Error fetching image', { status: response.status });
    }
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    return newResponse;
  } catch (error) {
    return new Response('Error fetching image', { status: 500 });
  }
}
