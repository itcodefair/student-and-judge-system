import { useMantineTheme, MantineBreakpoint } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

const useBreakPoint = (breakSize: MantineBreakpoint) => {
  const theme = useMantineTheme();
  const isM = useMediaQuery(`(max-width: ${theme.breakpoints[breakSize]})`);
  return isM;
};

export default useBreakPoint;
