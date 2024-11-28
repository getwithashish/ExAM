import { createTheme, ThemeProvider } from "@mui/material";
import { ConfigProvider, theme } from "antd";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface ThemeContextProps {
  theme: any;
  toggleTheme: () => void;
}

const muiDarkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
    },
  },
  transitions: {
    duration: {
      standard: 700,
    },
  },
});

const muiLightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#000000",
      secondary: "#4f4f4f",
    },
  },
  transitions: {
    duration: {
      standard: 700,
    },
  },
});

const { darkAlgorithm } = theme;

const antDarkTheme = {
  algorithm: darkAlgorithm,
  token: {
    motionDurationFast: "0.7s",
  },
  components: {
    Drawer: {
      colorBgElevated: "#161B21",
      colorText: "#FFFFFF",
    },
    Modal: {
      titleFontSize: 24,
    },
    Select: {
      multipleItemBorderColor: "transparent",
      colorBorder: "none",
    },
    Table: {
      colorBgContainer: "#161B21",
    },
    Button: {
      colorPrimary: "#161b21",
      colorPrimaryHover: "#1e2329",
      colorPrimaryActive: "#0e1114",
      colorText: "#ffffff",
    },
    Dropdown: {
      colorBgElevated: "#161b21",
      colorText: "#ffffff",
    },
  },
};

const { defaultAlgorithm } = theme;

const antLightTheme = {
  algorithm: defaultAlgorithm,
  token: {
    motionDurationFast: "0.7s",
  },
  components: {
    Drawer: {
      colorBgElevated: "#FFFFFF",
      colorText: "#000000",
    },
    Modal: {
      titleFontSize: 24,
      colorBg: "#FFFFFF",
      colorText: "#000000",
      headerBackground: "#f7f7f7",
    },
    Select: {
      multipleItemBorderColor: "transparent",
      colorBorder: "#d9d9d9",
      colorText: "#000000",
      colorBg: "#ffffff",
    },
    Table: {
      colorBgContainer: "#fafafa",
      colorText: "#ffffff",
    },
    Button: {
      colorPrimary: "#1890ff",
      colorPrimaryHover: "#40a9ff",
      colorPrimaryActive: "#096dd9",
      colorText: "#000000",
      borderRadius: "4px",
    },
    Dropdown: {
      colorBgElevated: "#ffffff",
      colorText: "#000000",
    },
    Input: {
      colorBgContainer: "#ffffff",
      colorText: "#000000",
      colorBorder: "#d9d9d9",
    },
    Checkbox: {
      colorPrimary: "#1890ff",
      colorText: "#000000",
    },
  },
};

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const customLightTheme = {
  theme: "light",
  muiTheme: muiLightTheme,
  antTheme: antLightTheme,
};

const customDarkTheme = {
  theme: "dark",
  muiTheme: muiDarkTheme,
  antTheme: antDarkTheme,
};

export const CustomThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
}) => {
  const [theme, setTheme] = useState<any>(
    localStorage.getItem("theme") === "light"
      ? customLightTheme
      : customDarkTheme
  );

  const modifyBodyClass = (newTheme: string | null = null) => {
    document.body.classList.remove("bg-gray-900", "bg-white");
    (newTheme ? newTheme : localStorage.getItem("theme")) === "light"
      ? document.body.classList.add("bg-white")
      : document.body.classList.add("bg-gray-900");
  };

  const toggleTheme = () => {
    const newTheme =
      localStorage.getItem("theme") === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme === "light" ? customLightTheme : customDarkTheme);

    modifyBodyClass(newTheme);
  };

  useEffect(() => {
    modifyBodyClass();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ThemeProvider theme={theme.muiTheme}>
        <ConfigProvider theme={theme.antTheme}>
          <div className={theme.theme}>{children}</div>
        </ConfigProvider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
