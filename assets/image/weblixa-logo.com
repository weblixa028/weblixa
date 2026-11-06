<svg width="180" height="52" viewBox="0 0 180 52" fill="none" xmlns="http://www.w3.org/2000/svg">

    <!-- W Symbol -->
    <defs>
        <linearGradient id="weblixaGradient"
                        x1="4"
                        y1="4"
                        x2="44"
                        y2="48"
                        gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#2563EB"/>
            <stop offset="0.5" stop-color="#7C3AED"/>
            <stop offset="1" stop-color="#06B6D4"/>
        </linearGradient>
    </defs>

    <path
        d="M6 9L15 38L25 14L35 38L44 9"
        stroke="url(#weblixaGradient)"
        stroke-width="8"
        stroke-linecap="round"
        stroke-linejoin="round"
    />

    <!-- Weblixa Text -->
    <text
        x="58"
        y="35"
        font-family="Arial, Helvetica, sans-serif"
        font-size="27"
        font-weight="700"
        fill="#102A56">
        Weblixa
    </text>

</svg>