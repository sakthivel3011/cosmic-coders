export const fetchTouristSpots = async (country) => {
  const titles = [
    `Tourist attractions in ${country}`,
    `Tourism in ${country}`,
    `${country} travel`
  ];

  for (let title of titles) {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const res = await fetch(url);

    if (res.ok) {
      return await res.json();
    }
  }

  return null;
};
