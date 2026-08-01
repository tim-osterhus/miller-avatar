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
const paddingFactor = 1.2;
export const maximumViewportDimension = 8_192;
export const maximumViewportPixels = maximumViewportDimension * maximumViewportDimension;

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
  const distance = Math.max(
    verticalDistance,
    horizontalDistance,
    paddedDepth / 2 + depthMargin + 0.01,
  );
  const target = {
    x: bounds.min.x + width / 2,
    y: bounds.min.y + height / 2,
    z: bounds.min.z + depth / 2,
  };
  const near = Math.max(0.01, distance - paddedDepth / 2 - depthMargin);
  const far = Math.max(near + 0.01, distance + paddedDepth / 2 + depthMargin);
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
