import { VoidFn } from "@/types";
import { ReactElement, ReactNode } from "react";
import { create } from "zustand";

interface Config {
  header?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
  onClose?: VoidFunction;
}

interface DrawerStore {
  isOpen: boolean;
  setIsOpen: VoidFn<boolean>;
  config: Config;
  setConfig: VoidFn<Config>;
}

export const useDrawer = create<DrawerStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set(() => ({ isOpen })),
  config: {},
  setConfig: (config) => set(() => ({ config })),
}));
