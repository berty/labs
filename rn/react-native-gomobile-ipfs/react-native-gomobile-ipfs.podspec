require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-gomobile-ipfs"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = "https://github.com/tesseract-one/react-native-gomobile-ipfs"
  s.license      = { :type => "Apache-2.0", :file => "LICENSE" }
  s.authors      = { "Tesseract Systemc, Inc." => "info@tesseract.one" }
  s.platforms    = { :ios => "10.0" }
  s.source       = { :git => "https://github.com/tesseract-one/react-native-gomobile-ipfs.git", :tag => "#{s.version}" }

  s.source_files = "ios/Sources/*.{h,c,m,swift}"
  s.requires_arc = true

  s.dependency "React"
  s.dependency 'Gomobile-IPFS-Bridge', '~> 1.2.0'
end

