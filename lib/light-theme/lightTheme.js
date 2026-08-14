const lightTheme = {
  /*                     SURFACE                          */
  "--surface-level-0": "var(--new-lightgray-200)", // #EDEDED
  "--surface-level-1": "var(--new-lightgray-50)", // #FAFAFA
  "--surface-level-1-alt": "var(--new-lightgray-400)", // #E0DFDF
  "--surface-level-2": "var(--new-lightgray-100)", // #F5F4F4
  "--surface-level-2-alt": "var(--new-lightgray-500)", //#CCCCCC
  "--surface-level-3": "var(--new-lightgray-50)", // #FAFAFA
  "--surface-level-3-alt": "var(--new-lightgray-300)", // #E9E9E9
  "--surface-scrim": "color-mix(in srgb, var(--new-black) 20%, transparent)",
  "--scrollbar-thumb": "color-mix(in srgb, var(--new-gray-100) 20%, transparent)",
  "--scrollbar-thumb-hover": "color-mix(in srgb, var(--new-gray-100) 50%, transparent)",
  "--surface-cell-hover": "var(--new-lightgray-300)", // #E9E9E9
  "--surface-cell-highlight": "var(--new-lightgray-300)", // #E9E9E9
  "--surface-cell-highlight-positive": "var(--new-emerald-100)", // #D0FAE5
  /*                     TEXT                          */
  "--text-default": "var(--new-lightgray-1100)", // #2B2B2B
  "--text-secondary": "var(--new-lightgray-800)", // #6A6868
  "--text-tertiary": "var(--new-gray-200)", // #ADADAD
  "--text-inverted": "var(--new-lightgray-50)", // #FAFAFA
  "--text-on-inactive": "var(--new-lightgray-900)", // #4D4D4D
  "--text-on-draft": "var(--new-orange-900)", // #7E2A0C
  "--text-pending": "var(--new-blue-500)", // #2B7FFF
  "--text-on-pending": "var(--new-blue-900)", // #1C398E
  "--text-on-progress": "var(--new-fuchsia-800)", // #8A0194
  "--text-positive": "var(--new-emerald-600)", // #009966
  "--text-on-positive": "var(--new-green-800)", // #016630
  "--text-negative": "var(--new-red-600)", // #E7000B
  "--text-on-negative": "var(--new-red-800)", // #9F0712
  "--text-warning": "var(--new-lightgray-800)", // #6A6868
  "--text-on-warning": "var(--new-yellow-800)", // #894B00
  "--text-on-warning-alt": "var(--new-yellow-800)", // #894B00
  "--text-white-on-dark": "var(--new-lightgray-50)", // #FAFAFA
  "--text-dark-on-white": "var(--new-gray-1200)", // #151515
  "--text-on-disabled-magic": "var(--new-fuchsia-100)", // #F3E8FF
  /*                     ICON                          */
  "--icon-default": "var(--new-lightgray-1100)", // #2B2B2B
  "--icon-secondary": "var(--new-gray-500)", // #7E7E7E
  "--icon-tertirary": "var(--new-lightgray-700)", // #CCCCCC
  "--icon-inverted": "var(--new-lightgray-100)", // #F5F4F4
  "--icon-on-inactive": "var(--new-lightgray-900)", // #4D4D4D
  "--icon-pending": "var(--new-blue-400)", // #51A2FF
  "--icon-on-pending": "var(--new-blue-900)", // #1C398E
  "--icon-positive": "var(--new-emerald-600)", // #009966
  "--icon-on-positive": "var(--new-green-800)", // #016630
  "--icon-negative": "var(--new-red-500)", // #FB2C36
  "--icon-on-negative": "var(--new-red-800)", // #9F0712
  "--icon-warning": "var(--new-orange-500)", // #FF6900
  "--icon-on-warning": "var(--new-yellow-800)", // #894B00
  "--icon-on-progress": "var(--new-fuchsia-800)", // #8A0194
  "--icon-on-disabled-magic": "var(--new-fuchsia-100)", // #F3E8FF
  "--icon-on-accent": "var(--new-cyan-600)", // #0092B8
  /*                     BORDER                          */
  "--border-default": "var(--new-lightgray-600)", // #CAC8C8
  "--border-secondary": "var(--new-lightgray-500)", // #CCCCCC
  "--border-tertiary": "var(--new-lightgray-400)", // #E0DFDF
  "--border-hover": "var(--new-lightgray-700)", // #7E7E7E
  "--border-focus": "var(--new-blue-400)", // #51A2FF
  "--border-selected": "var(--new-yellow-500)", // #F0B100
  "--border-negative": "var(--new-red-600)", // #E7000B
  "--border-warning": "var(--new-orange-500)", // #FF6900
  /*                     EFFECTS                          */
  "--effect-drop-shadow": "color-mix(in srgb, var(--new-black) 4%, transparent)",
  "--effect-inner-shadow-hint": "color-mix(in srgb, var(--new-white) 40%, transparent)",
  "--effect-inner-shadow-hint-bolder": "color-mix(in srgb, var(--new-white) 40%, transparent)",
  "--effect-drop-shadow-strong": "color-mix(in srgb, var(--new-black) 11%, transparent)",
  "--effect-dashboard-widget-shadow": "color-mix(in srgb, var(--new-black) 8%, transparent)",
  /*                     GRADIENT                          */
  "--gradient-cta-fill-start": "var(--new-pink-400)", // #FB64B6
  "--gradient-cta-fill-end": "var(--new-purple-500)", // #AD46FF
  "--gradient-cta-stroke-start": "color-mix(in srgb, var(--new-white) 20%, transparent)",
  "--gradient-cta-stroke-end": "color-mix(in srgb, var(--new-black) 20%, transparent)",
  "--gradient-credit-start": "var(--new-blue-200)", // #BEDBFF
  "--gradient-credit-end": "color-mix(in srgb, var(--new-blue-200) 0%, transparent)",
  "--gradient-debit-start": "var(--new-green-300)", // #7BF1A8
  "--gradient-debit-end": "color-mix(in srgb, var(--new-green-300) 0%, transparent)",
  "--gradient-neutral-stroke-start": "var(--new-lightgray-400)", // #E0DFDF
  "--gradient-neutral-stroke-end": "var(--new-lightgray-500)", // #CCCCCC
  /*                     BUTTON                          */
  "--button-primary": "var(--new-lightgray-1100)", // #2B2B2B
  "--button-secondary": "var(--new-lightgray-300)", // #E9E9E9
  "--button-hover-default": "var(--new-lightgray-1200)", // #222222
  "--button-hover-alt1": "var(--new-lightgray-400)", // #E0DFDF
  "--button-hover-alt2": "color-mix(in srgb, var(--new-white) 20%, transparent)",
  "--button-pressed-default": "var(--new-gray-1200)", // #151515
  "--button-pressed-alt1": "var(--new-lightgray-500)", // #CCCCCC
  "--button-pressed-alt2": "color-mix(in srgb, var(--new-white) 30%, transparent)",
  "--button-inactive-default": "var(--new-lightgray-200)", // #EDEDED
  "--button-inactive-alt1": "var(--new-lightgray-300)", // #E9E9E9
  "--button-inactive-alt2": "color-mix(in srgb, var(--new-white) 40%, transparent)",
  "--button-selected-default": "var(--new-lightgray-400)", // #E0DFDF
  "--button-selected-alt1": "var(--new-lightgray-600)", // #CAC8C8
  "--button-selected-alt2": "var(--new-blue-500)", // #2B7FFF
  "--button-selected-alt3": "var(--new-emerald-500)", // #00BC7D
  "--button-selected-alt3-disabled-bg": "var(--new-emerald-200)", // #A4F4CF
  "--button-selected-alt3-disabled-circle": "var(--new-emerald-50)", // #ECFDF5
  "--button-negative": "var(--new-red-500)", // #FB2C36
  "--button-negative-hover": "var(--new-red-600)", // #E7000B
  "--button-negative-pressed": "var(--new-red-800)", // #9F0712
  "--button-negative-disabled": "var(--new-red-200)", // #FFC9C9
  /*                     STATUS                          */
  "--status-default": "var(--new-lightgray-500)", // #CCCCCC
  "--status-inactive": "var(--new-lightgray-500)", // #CCCCCC
  "--status-draft": "var(--new-orange-200)", // #FFB86A
  "--status-pending": "var(--new-blue-200)", // #BEDBFF
  "--status-progress": "var(--new-purple-200)", // #E9D4FF
  "--status-positive": "var(--new-green-200)", // #B9F8CF
  "--status-negative": "var(--new-red-200)", // #FFC9C9
  "--status-warning": "var(--new-yellow-200)", // #FFF085
  "--status-warning-alt": "rgba(255, 224, 0, 0.45)", // #FFE000 45%
  "--status-counter": "var(--new-lightgray-900)", // #4D4D4D
  "--status-accent": "var(--new-cyan-200)", // #A2F4FD
  /*                     INPUT                          */
  "--input-default": "var(--new-lightgray-300)", // #E9E9E9
  "--input-disabled": "var(--new-lightgray-200)", // #EDEDED
  "--input-pill": "var(--new-lightgray-500)", // #CCCCCC
  "--input-pill-disabled": "var(--new-lightgray-300)", // #E9E9E9
  /*                     CHART                          */
  "--chart-progress": "var(--new-blue-400)", // #51A2FF
  "--chart-remaining": "var(--new-lightgray-500)", // #CCCCCC
  "--chart-blue": "var(--new-blue-200)", // #BEDBFF
  "--chart-blue-alt": "var(--new-blue-400)", // #51A2FF
  "--chart-cyan": "var(--new-cyan-300)", // #53EAFD
  "--chart-cyan-alt": "var(--new-cyan-500)", // #00B8DB
  "--chart-green": "var(--new-emerald-400)", // #00BC7D
  "--chart-yellow": "var(--new-yellow-400)", // #FDC700
  "--chart-orange": "var(--new-orange-200)", // #FFB86A
  "--chart-red": "var(--new-red-200)", // #FFC9C9
  "--chart-purple": "var(--new-purple-300)", // #DAB2FF

  "--avatar-blue": "var(--new-cyan-700)", // #007595
  "--avatar-orange": "var(--new-orange-600)", // #F54900
  "--avatar-red": "var(--new-red-800)", // #9F0712
  "--avatar-green": "var(--new-emerald-800)", // #006045

  "--illustration-drop-shadow": "#7D89D626",
  "--illustration-hue": "#4C98B90D",
  "--illustration-bg-top": "#FFFFFF99",
  "--illustration-bg-bottom": "#E8E8E866",
  "--illustration-bg-bottom-alt": "#D5D5D500",
  "--illustration-stroke-top": "#B3E8FFCC",
  "--illustration-stroke-top-alt": "#88A9BCFF",
  "--illustration-stroke-bottom": "#EF959566",
  "--illustration-stroke-bottom-alt": "#EF959500",
  "--illustration-stroke-70": "#A9E1FFB2",
  "--illustration-stroke-50": "#C5E3FA80",
  "--illustration-stroke-30": "#EAC5E64D",
  "--illustration-stroke-10": "#7047621A",
};

module.exports = lightTheme;
