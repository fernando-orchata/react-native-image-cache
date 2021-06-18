/// <reference types="react" />
import { IProps } from './types';
declare const defaultProps: {
    onError: () => void;
};
declare const CachedImage: {
    (props: IProps & typeof defaultProps): JSX.Element;
    defaultProps: {
        onError: () => void;
    };
};
export default CachedImage;
