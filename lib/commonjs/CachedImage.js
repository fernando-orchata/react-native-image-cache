"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _CacheManager = _interopRequireDefault(require("./CacheManager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const AnimatedImage = _reactNative.Animated.createAnimatedComponent(_reactNative.Image);

const AnimatedView = _reactNative.Animated.View;
const defaultProps = {
  onError: () => {}
};

const CachedImage = props => {
  const [error, setError] = _react.default.useState(false);

  const [uri, setUri] = _react.default.useState(undefined);

  const {
    source: propsSource
  } = props;

  const animatedImage = _react.default.useRef(new _reactNative.Animated.Value(0)).current;

  const animatedThumbnailImage = _react.default.useRef(new _reactNative.Animated.Value(0)).current;

  const animatedLoadingImage = _react.default.useRef(new _reactNative.Animated.Value(1)).current;

  (0, _react.useEffect)(() => {
    if (propsSource !== uri) {
      load(props).catch();
    }
    /* eslint-disable react-hooks/exhaustive-deps */

  }, [propsSource, uri]);

  const load = async ({
    cacheKey,
    onError,
    options = {},
    source
  }) => {
    if (source) {
      try {
        const path = await _CacheManager.default.get(source, options, cacheKey || source).getPath();

        if (path) {
          setUri(path);
          setError(false);
        } else {
          setError(true);
          onError({
            nativeEvent: {
              error: new Error('Could not load image')
            }
          });
        }
      } catch (e) {
        setError(true);
        onError({
          nativeEvent: {
            error: e
          }
        });
      }
    }
  };

  const onThumbnailLoad = () => {
    setTimeout(() => {
      _reactNative.Animated.timing(animatedLoadingImage, {
        toValue: 0,
        useNativeDriver: true
      }).start(() => {
        _reactNative.Animated.timing(animatedThumbnailImage, {
          toValue: 1,
          duration: props.thumbnailAnimationDuration || _CacheManager.default.config.thumbnailAnimationDuration,
          useNativeDriver: true
        }).start();
      });
    }, 5000);
  };

  const onImageError = () => setError(true);

  const onImageLoad = () => {
    _reactNative.Animated.timing(animatedImage, {
      toValue: 1,
      duration: props.sourceAnimationDuration || _CacheManager.default.config.sourceAnimationDuration,
      useNativeDriver: true
    }).start();
  };

  const {
    blurRadius,
    loadingImageComponent: LoadingImageComponent,
    loadingImageStyle = props.style,
    loadingSource,
    resizeMode,
    style,
    thumbnailSource,
    ...rest
  } = props;
  const isImageReady = !!uri;
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.container
  }, !isImageReady && (LoadingImageComponent ? /*#__PURE__*/_react.default.createElement(AnimatedView, {
    style: [styles.loadingImageStyle, {
      opacity: animatedLoadingImage
    }]
  }, /*#__PURE__*/_react.default.createElement(LoadingImageComponent, null)) : /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.loadingImageStyle, style]
  }, /*#__PURE__*/_react.default.createElement(AnimatedImage, {
    resizeMode: resizeMode || 'contain',
    style: [{
      opacity: animatedLoadingImage
    }, loadingImageStyle] // @ts-ignore
    ,
    source: loadingSource
  }))), /*#__PURE__*/_react.default.createElement(AnimatedImage, {
    blurRadius: blurRadius || _CacheManager.default.config.blurRadius,
    onLoad: onThumbnailLoad,
    resizeMode: resizeMode || 'contain',
    source: {
      uri: thumbnailSource
    },
    style: [{
      opacity: animatedThumbnailImage
    }, style]
  }), /*#__PURE__*/_react.default.createElement(AnimatedImage, _extends({}, rest, {
    onError: onImageError,
    onLoad: onImageLoad,
    resizeMode: resizeMode || 'contain' // @ts-ignore
    ,
    source: error || !uri ? loadingSource : {
      uri: _reactNative.Platform.OS === 'android' ? `file://${uri}` : uri
    } // @ts-ignore
    ,
    style: [styles.imageStyle, {
      opacity: animatedImage
    }, style]
  })));
};

const styles = _reactNative.StyleSheet.create({
  container: {
    backgroundColor: 'transparent'
  },
  imageStyle: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  loadingImageStyle: {
    alignItems: 'center',
    alignSelf: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  }
});

CachedImage.defaultProps = defaultProps;
var _default = CachedImage;
exports.default = _default;
//# sourceMappingURL=CachedImage.js.map