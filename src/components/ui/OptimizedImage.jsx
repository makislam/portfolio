import React, { useState, useRef, useEffect } from 'react';

/**
 * OptimizedImage - A wrapper component for lazy-loaded images with blur-up effect.
 * 
 * Features:
 * - Uses <picture> with WebP <source> + original fallback
 * - CSS blur-up fade-in transition on load
 * - loading="lazy" by default (set eager=true for above-the-fold)
 * - decoding="async" for better performance
 * 
 * Props:
 * - src: original image path (e.g., "/projects/drone-1.png")
 * - alt: alt text
 * - className: additional classes for the <img>
 * - eager: if true, uses loading="eager" (for hero/above-fold images)
 * - useThumbnail: if true, uses thumb- prefixed WebP for src
 * - containerClassName: classes for the wrapper div
 * - ...rest: passed to <img>
 */
export default function OptimizedImage({
    src,
    alt = '',
    className = '',
    eager = false,
    useThumbnail = false,
    containerClassName = '',
    ...rest
}) {
    const [loaded, setLoaded] = useState(false);
    const imgRef = useRef(null);

    // Generate WebP path from original src
    const getWebPPath = (originalSrc) => {
        if (!originalSrc) return '';
        // For /projects/ images, serve from the webp/ subfolder
        const lastSlash = originalSrc.lastIndexOf('/');
        const dir = originalSrc.substring(0, lastSlash + 1);
        const file = originalSrc.substring(lastSlash + 1);
        const lastDot = file.lastIndexOf('.');
        if (lastDot === -1) return originalSrc;
        const name = file.substring(0, lastDot);
        if (dir.startsWith('/projects/')) {
            return `/projects/webp/${name}.webp`;
        }
        return `${dir}${name}.webp`;
    };

    // Generate thumbnail path
    const getThumbPath = (originalSrc) => {
        if (!originalSrc) return '';
        const lastSlash = originalSrc.lastIndexOf('/');
        const file = originalSrc.substring(lastSlash + 1);
        const lastDot = file.lastIndexOf('.');
        const nameWithoutExt = file.substring(0, lastDot);
        const dir = originalSrc.substring(0, lastSlash + 1);
        if (dir.startsWith('/projects/')) {
            return `/projects/thumbs/thumb-${nameWithoutExt}.webp`;
        }
        return `${dir}thumb-${nameWithoutExt}.webp`;
    };

    const webpSrc = useThumbnail ? getThumbPath(src) : getWebPPath(src);

    // Check if already loaded (cached images)
    useEffect(() => {
        if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
            setLoaded(true);
        }
    }, [src]);

    return (
        <div
            className={`optimized-image-wrapper ${containerClassName}`}
            style={{ position: 'relative', overflow: 'hidden' }}
        >
            <picture>
                <source srcSet={webpSrc} type="image/webp" />
                <img
                    ref={imgRef}
                    src={src}
                    alt={alt}
                    loading={eager ? 'eager' : 'lazy'}
                    decoding="async"
                    onLoad={() => setLoaded(true)}
                    className={`${className} optimized-image ${loaded ? 'optimized-image--loaded' : ''}`}
                    {...rest}
                />
            </picture>
        </div>
    );
}
