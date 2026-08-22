import Testing
@testable import MillerAvatarHost

@Test func hostUsesFoundationIdentity() {
    #expect(MillerAvatarHost.productName == "Miller Avatar")
}
