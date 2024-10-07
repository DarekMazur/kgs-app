export default (baseLat: number, baseLng: number, lat: number, lng: number) => {
  if (baseLat === lat && baseLng === lng) {
    return 0;
  }

  const radLat1 = (Math.PI * baseLat) / 180;
  const radLat2 = (Math.PI * lat) / 180;
  const theta = baseLng - lng;
  const radTheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radLat1) * Math.sin(radLat2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);

  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  dist *= 1.609344;

  return dist;
};
