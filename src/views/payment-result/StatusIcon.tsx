import { type SVGProps,useId } from 'react';

const LAYERS = [0, 1, 2] as const;

const ICONS = {
    success: {
        path: 'M44 0C68.3005 0 88 19.6995 88 44C88 68.3005 68.3005 88 44 88C19.6995 88 0 68.3005 0 44C0 19.6995 19.6995 0 44 0ZM63.6436 30.0967C61.7765 28.2297 58.7489 28.2297 56.8799 30.0967L38.2617 48.7139L31.123 41.5742C29.256 39.7072 26.2274 39.7073 24.3584 41.5742C22.4894 43.4413 22.4913 46.4699 24.3584 48.3389L33.2441 57.2246C36.0161 59.9966 40.5083 59.9966 43.2803 57.2246L63.6436 36.8613C65.5107 34.9923 65.5107 31.9638 63.6436 30.0967Z',
        shadowMatrix:
            '0 0 0 0 0.4 0 0 0 0 1 0 0 0 0 0.545946 0 0 0 1 0',
        startColor: '#7BD300',
        endColor: '#84FF00',
    },
    failed: {
        path: 'M44 0C68.3005 0 88 19.6995 88 44C88 68.3005 68.3005 88 44 88C19.6995 88 0 68.3005 0 44C0 19.6995 19.6995 0 44 0ZM55.7988 28C54.8534 28.0001 53.9086 28.3334 53.1553 29C53.0927 29.0553 53.0305 29.112 52.9707 29.1719C52.576 29.5646 47.5091 34.6344 43.8994 38.2441L34.8271 29.1719C34.5834 28.9281 34.3159 28.7224 34.0322 28.5547C33.4074 28.1852 32.7032 28 31.999 28C30.9751 28 29.9509 28.3899 29.1709 29.1719C27.6089 30.7338 27.609 33.2661 29.1709 34.8281C29.5629 35.2221 34.6332 40.2904 38.2432 43.9004C34.6335 47.5101 29.5656 52.577 29.1709 52.9717C27.609 54.5336 27.6091 57.0659 29.1709 58.6279C29.5127 58.9698 29.901 59.2375 30.3154 59.4297C30.4336 59.4845 30.5538 59.5335 30.6758 59.5762C31.4699 59.8539 32.3345 59.873 33.1387 59.6348C33.695 59.4702 34.2226 59.1825 34.6777 58.7705C34.7285 58.7246 34.7782 58.6769 34.8271 58.6279L43.8994 49.5557C47.5085 53.1647 52.5744 58.2316 52.9707 58.6279C53.2321 58.8893 53.5215 59.1064 53.8281 59.2803C54.0371 59.3988 54.2537 59.4983 54.4766 59.5762C54.965 59.7469 55.4801 59.8194 55.9912 59.7949C56.1189 59.7888 56.2463 59.777 56.373 59.7588C56.6271 59.7222 56.8785 59.6617 57.123 59.5762C57.5504 59.4269 57.9571 59.2023 58.3232 58.9033C58.4281 58.8178 58.5292 58.7257 58.627 58.6279C60.189 57.0659 60.189 54.5337 58.627 52.9717C58.2326 52.5754 53.1637 47.5095 49.5547 43.9004L58.627 34.8281C60.189 33.2661 60.189 30.7339 58.627 29.1719C58.5292 29.0744 58.428 28.9828 58.3232 28.8975C58.0089 28.6411 57.6649 28.4394 57.3037 28.293C56.8225 28.0974 56.3107 28 55.7988 28Z',
        shadowMatrix:
            '0 0 0 0 1 0 0 0 0 0.6 0 0 0 0 0.6 0 0 0 1 0',
        startColor: '#FF4D4D',
        endColor: '#FF4D4D',
    },
};

interface StatusIconProps extends SVGProps<SVGSVGElement> {
    variant: keyof typeof ICONS;
}

export const StatusIcon = ({ variant, ...props }: StatusIconProps) => {
    const icon = ICONS[variant];
    const id = useId().replace(/:/g, '');

    const filterId = (layer: number) => `${id}-${variant}-filter-${layer}`;
    const gradientId = (layer: number) => `${id}-${variant}-paint-${layer}`;

    return (
        <svg
            width="88"
            height="88"
            viewBox="0 0 88 88"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            focusable="false"
            {...props}
        >
            {LAYERS.map((layer) => (
                <g
                    key={layer}
                    filter={`url(#${filterId(layer)})`}
                >
                    <path
                        d={icon.path}
                        fill={`url(#${gradientId(layer)})`}
                    />
                </g>
            ))}

            <defs>
                {LAYERS.map((layer) => (
                    <filter
                        key={filterId(layer)}
                        id={filterId(layer)}
                        x="0"
                        y="0"
                        width="88"
                        height="88"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                    >
                        <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                        />
                        <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                        />
                        <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                        />
                        <feOffset />
                        <feGaussianBlur stdDeviation="3.34783" />
                        <feComposite
                            in2="hardAlpha"
                            operator="arithmetic"
                            k2="-1"
                            k3="1"
                        />
                        <feColorMatrix
                            type="matrix"
                            values={icon.shadowMatrix}
                        />
                        <feBlend
                            mode="normal"
                            in2="shape"
                            result={`effect1_innerShadow_${layer}`}
                        />
                    </filter>
                ))}

                {LAYERS.map((layer) => (
                    <radialGradient
                        key={gradientId(layer)}
                        id={gradientId(layer)}
                        cx="0"
                        cy="0"
                        r="1"
                        gradientTransform="matrix(-7.143 245.447 -245.567 -13.6962 48.7143 47.7705)"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop
                            stopColor={icon.startColor}
                            stopOpacity="0"
                        />
                        <stop
                            offset="1"
                            stopColor={icon.endColor}
                        />
                    </radialGradient>
                ))}
            </defs>
        </svg>
    );
};
