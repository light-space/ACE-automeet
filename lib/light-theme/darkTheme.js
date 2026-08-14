const darkTheme = {
  /*                     SURFACE                          */
  "--surface-level-0": "var(--new-gray-1200)", // #151515
  "--surface-level-1": "var(--new-gray-1100)", // #1F1F1F
  "--surface-level-1-alt": "var(--new-black)", // #000000
  "--surface-level-2": "var(--new-gray-1000)", // #262626
  "--surface-level-2-alt": "var(--new-gray-400)", //#666666
  "--surface-level-3": "var(--new-gray-1100)", // #1F1F1F
  "--surface-level-3-alt": "var(--new-gray-800)", // #404040
  "--surface-scrim": "color-mix(in srgb, var(--new-black) 40%, transparent)", // #00000040
  "--scrollbar-thumb": "color-mix(in srgb, var(--new-black) 50%, transparent)",
  "--scrollbar-thumb-hover": "color-mix(in srgb, var(--new-black) 90%, transparent)",
  "--surface-cell-hover": "var(--new-gray-700)", // #454545
  "--surface-cell-highlight": "var(--new-gray-900)", // #2E2E2E
  "--surface-cell-highlight-positive": "var(--new-emerald-900)", // #004F3B
  /*                     TEXT                          */
  "--text-default": "var(--new-lightgray-50)", // #FAFAFA
  "--text-secondary": "var(--new-gray-200)", // #ADADAD
  "--text-tertiary": "var(--new-lightgray-700)", // #7E7E7E
  "--text-inverted": "var(--new-gray-1200)", // #151515
  "--text-on-inactive": "var(--new-gray-200)", // #ADADAD
  "--text-draft": "var(--new-orange-400)", // #FF8904
  "--text-on-draft": "var(--new-orange-900)", // #7E2A0C
  "--text-pending": "var(--new-blue-300)", // #8EC5FF
  "--text-on-pending": "var(--new-blue-900)", // #1C398E
  "--text-on-progress": "var(--new-fuchsia-800)", // #8A0194
  "--text-positive": "var(--new-emerald-400)", // #00BC7D
  "--text-on-positive": "var(--new-emerald-900)", // #004F3B
  "--text-negative": "var(--new-red-400)", // #FF6467
  "--text-on-negative": "var(--new-red-1000)", // #460809
  "--text-warning": "var(--new-yellow-200)", // #FFF085
  "--text-on-warning": "var(--new-yellow-800)", // #894B00
  "--text-on-warning-alt": "var(--new-yellow-200)", // #FFF085
  "--text-white-on-dark": "var(--new-lightgray-50)", // #FAFAFA
  "--text-dark-on-white": "var(--new-gray-1200)", // #151515
  "--text-on-disabled-magic": "var(--new-fuchsia-700)", // #A800B7
  /*                     ICON                          */
  "--icon-default": "var(--new-gray-50)", // #DEDEDE
  "--icon-secondary": "var(--new-gray-200)", // #ADADAD
  "--icon-tertirary": "var(--new-gray-400)", // #666666
  "--icon-inverted": "var(--new-gray-1100)", // #1F1F1F
  "--icon-on-inactive": "var(--new-gray-50)", // #DEDEDE
  "--icon-pending": "var(--new-blue-400)", // #51A2FF
  "--icon-on-pending": "var(--new-blue-900)", // #1C398E
  "--icon-positive": "var(--new-emerald-500)", // #00BC7D
  "--icon-on-positive": "var(--new-emerald-800)", // #006045
  "--icon-negative": "var(--new-red-400)", // #FF6467
  "--icon-on-negative": "var(--new-red-1000)", // #460809
  "--icon-warning": "var(--new-yellow-200)", // #FFF085
  "--icon-on-warning": "var(--new-yellow-900)", // #733E0A
  "--icon-on-progress": "var(--new-fuchsia-800)", // #8A0194
  "--icon-on-disabled-magic": "var(--new-fuchsia-700)", // #A800B7
  "--icon-on-accent": "var(--new-cyan-500)", // #00B8DB
  /*                     BORDER                          */
  "--border-default": "var(--new-gray-400)", // #666666
  "--border-secondary": "var(--new-gray-600)", // #525252
  "--border-tertiary": "var(--new-gray-900)", // #2E2E2E
  "--border-hover": "var(--new-gray-100)", // #B9B9B9
  "--border-focus": "var(--new-blue-400)", // #51A2FF
  "--border-selected": "var(--new-yellow-200)", // #FFF085
  "--border-negative": "var(--new-red-400)", // #FF6467
  "--border-warning": "var(--new-yellow-200)", // #FFF085
  /*                     EFFECTS                          */
  "--effect-drop-shadow": "color-mix(in srgb, var(--new-black) 12%, transparent)",
  "--effect-inner-shadow-hint": "color-mix(in srgb, var(--new-white) 8%, transparent)",
  "--effect-inner-shadow-hint-bolder": "color-mix(in srgb, var(--new-white) 25%, transparent)",
  "--effect-drop-shadow-strong": "color-mix(in srgb, var(--new-black) 25%, transparent)",
  "--effect-dashboard-widget-shadow": "color-mix(in srgb, var(--new-white) 25%, transparent)",
  /*                     GRADIENT                          */
  "--gradient-cta-fill-start": "var(--new-pink-800)", // #A3004C
  "--gradient-cta-fill-end": "var(--new-purple-600)", // #9810FA
  "--gradient-cta-stroke-start": "color-mix(in srgb, var(--new-white) 25%, transparent)",
  "--gradient-cta-stroke-end": "color-mix(in srgb, var(--new-black) 40%, transparent)",
  "--gradient-credit-start": "var(--new-cyan-900)", // #104E64
  "--gradient-credit-end": "color-mix(in srgb, var(--new-cyan-900) 0%, transparent)",
  "--gradient-debit-start": "var(--new-green-900)", // #0D542B
  "--gradient-debit-end": "color-mix(in srgb, var(--new-green-900) 0%, transparent)",
  "--gradient-neutral-stroke-start": "var(--new-gray-300)", // #707070
  "--gradient-neutral-stroke-end": "var(--new-gray-1200)", // #151515
  /*                     BUTTON                          */
  "--button-primary": "var(--new-lightgray-50)", // #FAFAFA
  "--button-secondary": "var(--new-gray-800)", // #404040
  "--button-hover-default": "var(--new-gray-100)", // #B9B9B9
  "--button-hover-alt1": "var(--new-gray-900)", // #2E2E2E
  "--button-hover-alt2": "color-mix(in srgb, var(--new-black) 20%, transparent)",
  "--button-pressed-default": "var(--new-gray-300)", // #707070
  "--button-pressed-alt1": "var(--new-gray-1000)", // #262626
  "--button-pressed-alt2": "color-mix(in srgb, var(--new-black) 30%, transparent)",
  "--button-inactive-default": "var(--new-gray-800)", // #404040
  "--button-inactive-alt1": "var(--new-gray-1000)", // #262626
  "--button-inactive-alt2": "color-mix(in srgb, var(--new-black) 40%, transparent)",
  "--button-selected-default": "var(--new-gray-600)", // #525252
  "--button-selected-alt1": "var(--new-gray-800)", // #404040
  "--button-selected-alt2": "var(--new-blue-500)", // #2B7FFF
  "--button-selected-alt3": "var(--new-emerald-600)", // #009966
  "--button-selected-alt3-disabled-bg": "var(--new-emerald-900)", // #004F3B
  "--button-selected-alt3-disabled-circle": "var(--new-emerald-700)", // #007A55
  "--button-negative": "var(--new-red-600)", // #E7000B
  "--button-negative-hover": "var(--new-red-700)", // #C10007
  "--button-negative-pressed": "var(--new-red-900)", // #82181A
  "--button-negative-disabled": "var(--new-red-1000)", // #460809
  /*                     STATUS                          */
  "--status-default": "var(--new-gray-600)", // #4F4F4F
  "--status-inactive": "var(--new-gray-600)", // #525252
  "--status-draft": "var(--new-orange-200)", // #FFB86A
  "--status-pending": "var(--new-blue-300)", // #8EC5FF
  "--status-progress": "var(--new-purple-300)", // #DAB2FF
  "--status-positive": "var(--new-emerald-300)", // #00D492
  "--status-negative": "var(--new-red-400)", // #FF6467
  "--status-warning": "var(--new-yellow-200)", // #FFF085
  "--status-warning-alt": "rgba(255, 224, 0, 0.10)", // #FFE000 10%
  "--status-counter": "var(--new-lightgray-1000)", // #343434
  "--status-accent": "var(--new-cyan-900)", // #104E64
  /*                     INPUT                          */
  "--input-default": "var(--new-gray-800)", // #404040
  "--input-disabled": "var(--new-gray-900)", // #2E2E2E
  "--input-pill": "var(--new-gray-1100)", // #1F1F1F
  "--input-pill-disabled": "var(--new-gray-1000)", // #262626
  /*                     CHART                          */
  "--chart-progress": "var(--new-blue-400)", // #51A2FF
  "--chart-remaining": "var(--new-gray-800)", // #404040
  "--chart-blue": "var(--new-blue-300)", // #8EC5FF
  "--chart-blue-alt": "var(--new-blue-500)", // #2B7FFF
  "--chart-cyan": "var(--new-cyan-400)", // #53EAFD
  "--chart-cyan-alt": "var(--new-cyan-600)", // #0092B8
  "--chart-green": "var(--new-emerald-600)", // #009966
  "--chart-yellow": "var(--new-yellow-100)", // #FEF9C2
  "--chart-orange": "var(--new-orange-200)", // #FFB86A
  "--chart-red": "var(--new-red-200)", // #FFC9C9
  "--chart-purple": "var(--new-purple-400)", // #C27AFF

  "--avatar-blue": "var(--new-cyan-900)", // #FEF9C2
  "--avatar-orange": "var(--new-orange-900)", // #FFB86A
  "--avatar-red": "var(--new-red-1000)", // #FFC9C9
  "--avatar-green": "var(--new-green-800)", // #C27AFF

  "--illustration-drop-shadow": "#0000001A",
  "--illustration-hue": "#4C98B91A",
  "--illustration-bg-top": "#4D4D4D66",
  "--illustration-bg-bottom": "#00000033",
  "--illustration-bg-bottom-alt": "#00000000",
  "--illustration-stroke-top": "#4B98B9FF",
  "--illustration-stroke-top-alt": "#6F97B2FF",
  "--illustration-stroke-bottom": "#EF95954D",
  "--illustration-stroke-bottom-alt": "#EF959500",
  "--illustration-stroke-70": "#6D859AB2",
  "--illustration-stroke-50": "#80696F80",
  "--illustration-stroke-30": "#744C4C4D",
  "--illustration-stroke-10": "#7047471A",
};

module.exports = darkTheme;
