import { format, isValid } from "date-fns";
export const dataGridClassNames =
  "border border-gray-200 bg-white shadow dark:border-stroke-dark dark:bg-dark-secondary dark:text-gray-200";

export const dataGridSxStyles = (isDarkMode: boolean) => {
  return {
    "& .MuiDataGrid-columnHeaders": {
      color: `${isDarkMode ? "#e5e7eb" : ""}`,
      '& [role="row"] > *': {
        backgroundColor: `${isDarkMode ? "#1d1f21" : "white"}`,
        borderColor: `${isDarkMode ? "#2d3135" : ""}`,
      },
    },
    "& .MuiIconbutton-root": {
      color: `${isDarkMode ? "#a3a3a3" : ""}`,
    },
    "& .MuiTablePagination-root": {
      color: `${isDarkMode ? "#a3a3a3" : ""}`,
    },
    "& .MuiTablePagination-selectIcon": {
      color: `${isDarkMode ? "#a3a3a3" : ""}`,
    },
    "& .MuiDataGrid-cell": {
      border: "none",
    },
    "& .MuiDataGrid-row": {
      borderBottom: `1px solid ${isDarkMode ? "#2d3135" : "e5e7eb"}`,
    },
    "& .MuiDataGrid-withBorderColor": {
      borderColor: `${isDarkMode ? "#2d3135" : "e5e7eb"}`,
    },
  };
};

export const storageFactory = () => {
  return {
    setItem: (key: string, value: string) => {
      sessionStorage.setItem(key, value);
    },
    getItem: (key: string) => {
      return sessionStorage.getItem(key);
    },
    removeItem: (key: string) => {
      sessionStorage.removeItem(key);
    },
    clearStorage: () => {
      sessionStorage.clear();
    },
  };
};

export const generateNumericUUID = () => {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000000);
  return parseInt(`${timestamp}${randomNum}`.slice(-9));
};

export const convertBase64ToImage = (base64String: string) => {
  const image = `data:image/png;base64,${base64String}`;
  return image;
};

export const getImageSource = (
  value: string | null,
  defaultAvatar: string = `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 10) + 1}`,
): string => {
  if (value === null || value === "") return defaultAvatar;

  const isBase64 = value && value.startsWith("data:image");

  return isBase64 ? value : value ? defaultAvatar : "";
};

export const formatDate = (
  date: Date | string | number | null,
  formatString: string = "MM-dd-yyyy",
): string => {
  if (date === null) return "";

  const parsedDate =
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;

  return isValid(parsedDate) ? format(parsedDate, formatString) : "";
};
