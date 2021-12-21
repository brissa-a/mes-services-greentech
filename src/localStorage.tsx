import { useState, useEffect } from "react";

export function getStorageValue<Type>(key: string, defaultValue: Type) {
  // getting stored value
  const saved = localStorage.getItem(key);
  return saved && JSON.parse(saved) || defaultValue;
}

export function useLocalStorage<Type>(key: string, defaultValue: Type): [Type, React.Dispatch<React.SetStateAction<Type>>] {

  const [value, setValue] = useState<Type>(() => {
    return getStorageValue<Type>(key, defaultValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  window.addEventListener('storage', e => {
    if (e.key === key) {
      setValue(e.newValue ? JSON.parse(e.newValue) : defaultValue as Type)
    }
  })

  return [value, setValue];
};