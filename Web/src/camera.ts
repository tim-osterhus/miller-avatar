export interface Bounds3 {
  min: { x: number; y: number; z: number };
  max: { x: number; y: number; z: number };
  visibleMeshes: number;
}

export interface CameraFit {
  fovDegrees: 30;
  aspect: number;
  target: { x: number; y: number; z: number };
  position: { x: number; y: number; z: number };
  near: number;
  far: number;
}

const minimumExtent = 0.0001;
const paddingFactor = 1.1;
const cameraNear = 0.01;
const minimumCameraFar = 100;
const bottomBiasFraction = 0.4;
export const maximumViewportDimension = 8_192;
export const maximumViewportPixels = maximumViewportDimension * maximumViewportDimension;

export function expandBoundsForOffsets(
  bounds: Bounds3,
  offsets: readonly { x: number; y: number; z: number }[],
): Bounds3 {
  const finiteOffsets = offsets.filter(({ x, y, z }) => [x, y, z].every(Number.isFinite));
  const minimum = { x: 0, y: 0, z: 0 };
  const maximum = { x: 0, y: 0, z: 0 };
  for (const offset of finiteOffsets) {
    minimum.x = Math.min(minimum.x, offset.x);
    minimum.y = Math.min(minimum.y, offset.y);
    minimum.z = Math.min(minimum.z, offset.z);
    maximum.x = Math.max(maximum.x, offset.x);
    maximum.y = Math.max(maximum.y, offset.y);
    maximum.z = Math.max(maximum.z, offset.z);
  }
  return {
    min: {
      x: bounds.min.x + minimum.x,
      y: bounds.min.y + minimum.y,
      z: bounds.min.z + minimum.z,
    },
    max: {
      x: bounds.max.x + maximum.x,
      y: bounds.max.y + maximum.y,
      z: bounds.max.z + maximum.z,
    },
    visibleMeshes: bounds.visibleMeshes,
  };
}

export function fitCamera(bounds: Bounds3, viewportWidth: number, viewportHeight: number): CameraFit {
  const values = [
    bounds.min.x, bounds.min.y, bounds.min.z,
    bounds.max.x, bounds.max.y, bounds.max.z,
    viewportWidth, viewportHeight,
  ];
  if (
    bounds.visibleMeshes < 1 ||
    !values.every(Number.isFinite) ||
    !Number.isSafeInteger(viewportWidth) ||
    !Number.isSafeInteger(viewportHeight) ||
    viewportWidth <= 0 ||
    viewportHeight <= 0 ||
    viewportWidth > maximumViewportDimension ||
    viewportHeight > maximumViewportDimension ||
    viewportWidth * viewportHeight > maximumViewportPixels
  ) {
    throw new RangeError("camera fit requires finite visible bounds and viewport");
  }
  const width = bounds.max.x - bounds.min.x;
  const height = bounds.max.y - bounds.min.y;
  const depth = bounds.max.z - bounds.min.z;
  if (
    ![width, height, depth].every(Number.isFinite) ||
    width < 0 ||
    height < 0 ||
    depth < 0 ||
    Math.max(width, height, depth) < minimumExtent
  ) {
    throw new RangeError("camera fit requires non-degenerate ordered bounds");
  }
  const aspect = viewportWidth / viewportHeight;
  const halfVerticalFov = (30 * Math.PI / 180) / 2;
  const verticalDistance = (height * paddingFactor / 2) / Math.tan(halfVerticalFov);
  const horizontalDistance = (width * paddingFactor / 2) / (Math.tan(halfVerticalFov) * aspect);
  const paddedDepth = Math.max(depth * paddingFactor, minimumExtent);
  const depthMargin = paddedDepth * 0.01;
  const distance = Math.max(verticalDistance, horizontalDistance, 0.01)
    + paddedDepth / 2
    + depthMargin;
  const centerY = bounds.min.y + height / 2;
  const closestPaddedDistance = Math.max(
    0.01,
    distance - paddedDepth / 2 - depthMargin,
  );
  const availableHalfHeight = closestPaddedDistance * Math.tan(halfVerticalFov);
  const paddedHalfHeight = height * paddingFactor / 2;
  const verticalSurplus = Math.max(0, availableHalfHeight - paddedHalfHeight);
  const verticalBias = horizontalDistance > verticalDistance
    ? verticalSurplus * bottomBiasFraction
    : 0;
  const target = {
    x: bounds.min.x + width / 2,
    y: centerY + verticalBias,
    z: bounds.min.z + depth / 2,
  };
  // Keep the near plane away from the avatar's rest-pose depth. VRM skinning
  // and spring bones can move visible geometry toward the camera after the
  // static bounds have been measured, so a depth-tight near plane slices it.
  // These meter-scale defaults preserve depth precision without imposing a
  // hidden surface immediately in front of a posed avatar.
  const near = cameraNear;
  const far = Math.max(
    minimumCameraFar,
    distance + paddedDepth / 2 + depthMargin,
  );
  const result: CameraFit = {
    fovDegrees: 30,
    aspect,
    target,
    position: { x: target.x, y: target.y, z: target.z + distance },
    near,
    far,
  };
  if (![distance, near, far, ...Object.values(target), ...Object.values(result.position)].every(Number.isFinite)) {
    throw new RangeError("camera fit overflowed");
  }
  return result;
}
