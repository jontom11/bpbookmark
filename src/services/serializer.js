export default function(response) {
  const { data } = response;

  if (Array.isArray(data)) {
    return data.map(listing => {
      return {
        id: listing.id,
        title: listing.attributes.title,
        url: listing.attributes.url
      };
    });
  }

  return {
    id: data.id,
    title: data.attributes.title,
    url: data.attributes.url
  };
}
