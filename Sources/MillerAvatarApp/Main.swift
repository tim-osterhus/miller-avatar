import MillerAvatarCore
import MillerAvatarHost

@main
enum MillerAvatarApp {
    static func main() {
        _ = MillerAvatarHost.productName
        _ = MillerAvatarBuild.bundleIdentifier
    }
}
