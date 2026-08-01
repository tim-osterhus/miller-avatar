// swift-tools-version: 6.1

import PackageDescription

let package = Package(
    name: "MillerAvatar",
    platforms: [
        .macOS(.v15),
    ],
    products: [
        .library(name: "MillerAvatarCore", targets: ["MillerAvatarCore"]),
        .library(name: "MillerAvatarHost", targets: ["MillerAvatarHost"]),
        .executable(name: "MillerAvatarApp", targets: ["MillerAvatarApp"]),
    ],
    targets: [
        .target(name: "MillerAvatarCore"),
        .target(
            name: "MillerAvatarHost",
            dependencies: ["MillerAvatarCore"]
        ),
        .executableTarget(
            name: "MillerAvatarApp",
            dependencies: ["MillerAvatarCore", "MillerAvatarHost"]
        ),
        .testTarget(
            name: "MillerAvatarCoreTests",
            dependencies: ["MillerAvatarCore"]
        ),
        .testTarget(
            name: "MillerAvatarHostTests",
            dependencies: ["MillerAvatarHost"]
        ),
    ]
)
