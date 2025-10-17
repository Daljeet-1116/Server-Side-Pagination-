export const ArtworkService = {
  async getArtworks(page: number = 1, limit: number = 10) {
    const response = await fetch(
      `https://api.artic.edu/api/v1/artworks?page=${page}&limit=${limit}`
    );

    const data = await response.json();

    return {
      artworks: data.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        place_of_origin: item.place_of_origin,
        artist_display: item.artist_display,
        inscriptions: item.inscriptions,
        date_start: item.date_start,
        date_end: item.date_end,
      })),
      totalRecords: data.pagination.total,
    };
  },
};
