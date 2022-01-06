Pod::Spec.new do |spec|
  spec.name                = 'Gomobile-IPFS-Bridge'
  spec.version             = '1.1.1'
  spec.summary             = 'Swift module offering a simple interface to the underlying Gomobile-IPFS-Core objects'
  spec.homepage            = 'https://github.com/ipfs-shipyard/gomobile-ipfs'

  spec.license             = { :type => 'Apache-2.0 / MIT', :text => <<-LICENSE
http://www.apache.org/licenses/LICENSE-2.0.txt - http://www.opensource.org/licenses/mit-license.php
                               LICENSE
                             }
  spec.authors             = { 'Antoine Eddi' => 'antoine.e.b@gmail.com', 'Guilhem Fanton' => 'guilhem.fanton@gmail.com' }

  spec.platform            = :ios, '10.0'
  spec.source              = { :http => 'https://github.com/n0izn0iz/gomobile-ipfs/releases/download/v1.1.1/bridge-1.1.1.zip' }
  spec.swift_version       = '5.0'
  spec.static_framework    = true
  spec.source_files        = '*.swift'
  spec.header_dir          = 'GomobileIPFS'

  spec.dependency            'Gomobile-IPFS-Core', '~> 1.1.1'
end
