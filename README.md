# rn-red5pro-with-expo
This repository is to help reproduce the issue that I am facing in using react-native-red5pro with expo and collaborate to fix the issue

# Steps followed while creating this example:
* Create new project on Expo XDE
* make sure app.jon has bundleIdentifier for ios
* `exp detach`
* `pod install`
* Open `ios/rn-red5pro-on-expo.xcworkspace` in xcode
* Build project. Build succeeds and simulator shows sample app view
* Now start adding `react-native-red5pro` specific changes.
* `yarn add https://github.com/infrared5/react-native-red5pro/tarball/develop`
* `yarn add react-native-permissions`
* Copy `publisher.js` from https://github.com/infrared5/react-native-red5pro/blob/62387fac33b01d7b8a718c27ea2e6b7d949c9489/example/src/views/publisher.js
* `react-native link`. No errors while linking
* `cd ios`
* `pod install`
* Follow steps for ios as given at https://github.com/infrared5/react-native-red5pro/blob/master/README.md
* Build failed with error `rn-red5pro-with-expo/rn-red5pro-with-expo/node_modules/react-native-red5pro/ios/R5VideoView/R5VideoView/R5VideoViewManager.m:9:9: 'React/RCTViewManager.h' file not found`


