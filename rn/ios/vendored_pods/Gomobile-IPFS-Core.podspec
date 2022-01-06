Pod::Spec.new do |spec|
  spec.name                = 'Gomobile-IPFS-Core'
  spec.version             = '1.1.1'
  spec.summary             = 'iOS Gomobile package exposing go-ipfs methods required by Gomobile-IPFS-Bridge'
  spec.homepage            = 'https://github.com/ipfs-shipyard/gomobile-ipfs'

  spec.license             = { :type => 'Apache-2.0 / MIT', :text => <<-LICENSE
http://www.apache.org/licenses/LICENSE-2.0.txt - http://www.opensource.org/licenses/mit-license.php
                               LICENSE
                             }
  spec.authors             = { 'Antoine Eddi' => 'antoine.e.b@gmail.com', 'Guilhem Fanton' => 'guilhem.fanton@gmail.com' }

  spec.platform            = :ios, '10.0'
  spec.source              = { :http => 'https://github.com/n0izn0iz/gomobile-ipfs/releases/download/v1.1.1/core-1.1.1.zip' }

  spec.vendored_frameworks = 'Core.xcframework'
end
