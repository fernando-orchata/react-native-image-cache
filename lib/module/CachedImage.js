function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { useEffect } from 'react';
import { Animated, Image as RNImage, Platform, StyleSheet, View } from 'react-native';
import CacheManager from './CacheManager';
const AnimatedImage = Animated.createAnimatedComponent(RNImage);
const AnimatedView = Animated.View;
const defaultProps = {
  onError: () => {}
};

const CachedImage = props => {
  const [error, setError] = React.useState(false);
  const [uri, setUri] = React.useState(undefined);
  const {
    source: propsSource
  } = props;
  const animatedImage = React.useRef(new Animated.Value(0)).current;
  const animatedThumbnailImage = React.useRef(new Animated.Value(0)).current;
  const animatedLoadingImage = React.useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (propsSource !== uri && uri !== '') {
      load(props).catch();
      setUri('');
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
        const path = await CacheManager.get(source, options, cacheKey || source).getPath();

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
      Animated.timing(animatedLoadingImage, {
        toValue: 0,
        useNativeDriver: true
      }).start(() => {
        Animated.timing(animatedThumbnailImage, {
          toValue: 1,
          duration: props.thumbnailAnimationDuration || CacheManager.config.thumbnailAnimationDuration,
          useNativeDriver: true
        }).start();
      });
    }, 5000);
  };

  const onImageError = () => setError(true);

  const onImageLoad = () => {
    Animated.timing(animatedImage, {
      toValue: 1,
      duration: props.sourceAnimationDuration || CacheManager.config.sourceAnimationDuration,
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
  return /*#__PURE__*/React.createElement(View, {
    style: styles.container
  }, !isImageReady && (LoadingImageComponent ? /*#__PURE__*/React.createElement(AnimatedView, {
    style: [styles.loadingImageStyle, {
      opacity: animatedLoadingImage
    }]
  }, /*#__PURE__*/React.createElement(LoadingImageComponent, null)) : /*#__PURE__*/React.createElement(View, {
    style: [styles.loadingImageStyle, style]
  }, /*#__PURE__*/React.createElement(AnimatedImage, {
    resizeMode: resizeMode || 'contain',
    style: [{
      opacity: animatedLoadingImage
    }, loadingImageStyle] // @ts-ignore
    ,
    source: loadingSource
  }))), /*#__PURE__*/React.createElement(AnimatedImage, {
    blurRadius: blurRadius || CacheManager.config.blurRadius,
    onLoad: onThumbnailLoad,
    resizeMode: resizeMode || 'contain',
    source: {
      uri: thumbnailSource
    },
    style: [{
      opacity: animatedThumbnailImage
    }, style]
  }), /*#__PURE__*/React.createElement(AnimatedImage, _extends({}, rest, {
    onError: onImageError,
    onLoad: onImageLoad,
    resizeMode: resizeMode || 'contain' // @ts-ignore
    ,
    source: error || !uri ? loadingSource : {
      uri: Platform.OS === 'android' ? `file://${uri}` : uri
    } // @ts-ignore
    ,
    style: [styles.imageStyle, {
      opacity: animatedImage
    }, style]
  })));
};

const styles = StyleSheet.create({
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
export default CachedImage;
//# sourceMappingURL=CachedImage.js.map