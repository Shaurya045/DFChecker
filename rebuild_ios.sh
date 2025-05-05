#!/bin/bash

set -e

echo "📦 Cleaning previous builds..."
rm -rf ios/Pods ios/Podfile.lock ios/build node_modules
rm -rf /Users/$USER/Library/Developer/Xcode/DerivedData/*
watchman watch-del-all || true

echo "📥 Installing dependencies..."
npm install

echo "📲 Installing CocoaPods..."
cd ios
pod install --repo-update
cd ..

echo "🧹 Cleaning React Native cache..."
npx react-native clean
npx react-native start --reset-cache &
sleep 5

echo "🚀 Building app for iOS..."
npx react-native run-ios
