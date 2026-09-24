export function calculateDistance(
  lat1,
  lon1,
  lat2,
  lon2
) {
  const R = 6371000;

  const dLat = toRadians(
    lat2 - lat1
  );

  const dLon = toRadians(
    lon2 - lon1
  );

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
}

export function calculateBearing(
  lat1,
  lon1,
  lat2,
  lon2
) {
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);

  const Δλ = toRadians(
    lon2 - lon1
  );

  const y =
    Math.sin(Δλ) *
    Math.cos(φ2);

  const x =
    Math.cos(φ1) *
      Math.sin(φ2) -
    Math.sin(φ1) *
      Math.cos(φ2) *
      Math.cos(Δλ);

  const bearing =
    Math.atan2(y, x);

  return (
    (toDegrees(bearing) + 360) %
    360
  );
}

function toRadians(degrees) {
  return (
    degrees *
    Math.PI /
    180
  );
}

function toDegrees(radians) {
  return (
    radians *
    180 /
    Math.PI
  );
}