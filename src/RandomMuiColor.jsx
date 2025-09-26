import { useTheme } from "@emotion/react";


export default function RandomMuiColor() {
  const theme = useTheme();
  const paletteColors = [
    'primary.main',
    'secondary.main',
    'error.main',
    'warning.main',
    'info.main',
    'success.main'
  ];
  const randomColor = paletteColors[
    Math.floor(Math.random() * paletteColors.length)
  ];
  return randomColor
}