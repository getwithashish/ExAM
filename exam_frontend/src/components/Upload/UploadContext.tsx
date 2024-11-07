import React, { createContext, useContext, useState } from "react";

interface UploadingContextType {
  uploading: boolean;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
}

const UploadingContext = createContext<UploadingContextType | undefined>(
  undefined
);

export const useUploading = () => {
  const context = useContext(UploadingContext);
  if (!context) {
    throw new Error("useUploading must be used within an UploadingProvider");
  }
  return context;
};

export const UploadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [uploading, setUploading] = useState(false);

  return (
    <UploadingContext.Provider value={{ uploading, setUploading }}>
      {children}
    </UploadingContext.Provider>
  );
};
