module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
        "module-resolver",
        {
            "root": ["."],
            "extensions": [
                ".ios.ts",
                ".android.ts",
                ".ts",
                ".ios.tsx",
                ".android.tsx",
                ".tsx",
                ".jsx",
                ".js",
                ".json"
            ],
            "alias": {
                "assets": "./src/assets",
                "constantsConfiguration": "./src/constantsConfiguration",
                "components": "./src/components",
                "reduxConfiguration": "./src/reduxConfiguration",
                "screens": "./src/screens",
                "services": "./src/services",
                "hoc": "./src/hoc",
                "api": "./src/api",
                "hooks": "./src/hooks",
                "navigation": "./src/navigation",
                "utilities": "./src/utilities"
            }
        }
    ],
    [
      'react-native-reanimated/plugin', {
          relativeSourceLocation: true,
      },
  ]
  ]
};
