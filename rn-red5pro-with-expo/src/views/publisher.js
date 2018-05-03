import React from 'react'
import {
    findNodeHandle,
    Button,
    StyleSheet,
    Text,
    View
} from 'react-native'
import {
    R5VideoView,
    publish,
    unpublish,
    swapCamera
} from 'react-native-red5pro'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    videoView: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'black'
    },
    button: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 40,
        backgroundColor: 'blue',
        color: 'white'
    },
    toast: {
        color: 'white',
        left: 0,
        right: 0,
        bottom: 0,
        padding: 10,
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 1.0)'
    }
})

const isValidStatusMessage = (value) => {
    return value && typeof value !== 'undefined' && value !== 'undefined' && value !== 'null'
}

export default class Publisher extends React.Component {
    constructor (props) {
        super(props)

        // Events.
        this.onMetaData = this.onMetaData.bind(this)
        this.onConfigured = this.onConfigured.bind(this)
        this.onPublisherStreamStatus = this.onPublisherStreamStatus.bind(this)
        this.onUnpublishNotification = this.onUnpublishNotification.bind(this)

        this.onSwapCamera = this.onSwapCamera.bind(this)

        this.state = {
            isInErrorState: false,
            buttonProps: {
                style: styles.button
            },
            toastProps: {
                style: styles.toast,
                value: 'waiting...'
            },
            videoProps: {
                style: styles.videoView,
                onMetaData: this.onMetaData,
                onConfigured: this.onConfigured,
                onPublisherStreamStatus: this.onPublisherStreamStatus,
                onUnpublishNotification: this.onUnpublishNotification
            }
        }
    }

    componentWillUnmount () {
        const nodeHandle = findNodeHandle(this.red5pro_video_publisher)
        const {
            streamProps: {
                configuration: {
                    streamName
                }
            }
        } = this.props
        if (nodeHandle) {
            unpublish(nodeHandle, streamName)
        }
    }

    render () {
        const {
            videoProps,
            toastProps,
            buttonProps
        } = this.state

        const {
            onStop,
            streamProps
        } = this.props

        const setup = Object.assign({}, streamProps, videoProps)

        const assignVideoRef = (video) => { this.red5pro_video_publisher = video }
        const assignToastRef = (toast) => { this.toast_field = toast }
        return (
            <View style={styles.container}>
                <R5VideoView
                    {...setup}
                    ref={assignVideoRef.bind(this)}
                />
                <Text
                    ref={assignToastRef.bind(this)}
                    {...toastProps}>{toastProps.value}</Text>
                <Button
                    {...buttonProps}
                    onPress={onStop}
                    title='Stop'
                    accessibilityLabel='Stop'
                />
                <Button
                    {...this.state.buttonProps}
                    onPress={this.onSwapCamera}
                    title='Swap Camera'
                    accessibilityLabel='Swap Camera'
                />
            </View>
        )
    }

    onMetaData (event) {
        console.log(`Publisher:onMetadata :: ${event.nativeEvent.metadata}`)
    }

    onConfigured (event) {
        const {
            streamProps: {
                configuration: {
                    streamName
                }
            }
        } = this.props

        console.log(`Publisher:onConfigured :: ${event.nativeEvent.key}`)
        publish(findNodeHandle(this.red5pro_video_publisher), streamName)
    }

    onPublisherStreamStatus (event) {
        console.log(`Publisher:onPublisherStreamStatus :: ${JSON.stringify(event.nativeEvent.status, null, 2)}`)
        const status = event.nativeEvent.status
        let message = isValidStatusMessage(status.message) ? status.message : status.name
        if (!this.state.inErrorState) {
            this.setState({
                toastProps: {...this.state.toastProps, value: message},
                isInErrorState: (status.code === 2)
            })
        }
    }

    onUnpublishNotification (event) {
        console.log(`Publisher:onUnpublishNotification:: ${JSON.stringify(event.nativeEvent.status, null, 2)}`)
        this.setState({
            isInErrorState: false,
            toastProps: {...this.state.toastProps, value: 'waiting...'}
        })
    }

    onSwapCamera (event) {
        console.log('Publisher:onSwapCamera()')
        swapCamera(findNodeHandle(this.red5pro_video_publisher))
    }
}