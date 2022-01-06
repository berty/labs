import React from "react"
import { View, Text, Image, useColorScheme } from "react-native"
import { Colors } from "react-native/Libraries/NewAppScreen"
import { useGomobileIPFS } from "./ipfsutil"

// const superlativeApesRoot = "/ipfs/QmbYCLEdnez33AnjigGAhM3ouNj8LMTXBwUqVLaLnUvBbU"
const superlativeApe = "/ipfs/QmQVS8VrY9FFpUWKitGhFzzx3xGixAd4frf1Czr7AQxeTc/1.png"
const externalGatewayURL = "https://gateway.pinata.cloud"

const style = { width: 42, height: 42 }

export const IPFSDemo: React.FC = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const mobileIPFS = useGomobileIPFS()
    const textStyle = {
        color: isDarkMode ? Colors.white : Colors.black,
    }

    if (mobileIPFS.state !== "up") {
        return <Text style={textStyle}>IPFS: {mobileIPFS.state}</Text>
    }
    return <View style={{ flexDirection: "row" }}>
        <View>
            <Text style={textStyle}>External gateway:</Text>
            <Image style={style} source={{ uri: externalGatewayURL + superlativeApe }} />
        </View>
        <View>
            <Text style={textStyle}>Gomobile gateway:</Text>
            <Image style={style} source={{ uri: mobileIPFS.gatewayURL + superlativeApe }} onError={({ nativeEvent: { error } }) => console.warn(error)} onLoad={((evt) => console.log("local loaded:", evt))} />
        </View>
    </View>
}